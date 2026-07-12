import React, { useCallback, useEffect, useState } from "react";
import { api, imageUrl } from "../api";
import DataTable from "../components/DataTable";
import {
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlinePhotograph,
  HiOutlinePencilAlt,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineCog,
} from "react-icons/hi";

const emptyRoom = {
  name: "",
  description: "",
  size: "",
  maxPerson: 2,
  price: "",
  image: "",
  imageLg: "",
  images: [],
  facilities: "Wifi, Breakfast, Parking",
  active: true,
};
const isVideo = (url = "") => /\.(mp4|webm|mov)(?:$|\?)/i.test(url);
const navigation = [
  ["overview", "Overview", HiOutlineHome],
  ["rooms", "Rooms", HiOutlineOfficeBuilding],
  ["bookings", "Bookings", HiOutlineCalendar],
  ["gallery", "Gallery", HiOutlinePhotograph],
  ["content", "Website content", HiOutlinePencilAlt],
  ["settings", "Hotel settings", HiOutlineCog],
];
const labels = {
  overview: ["Dashboard", "A live overview of your hotel operations."],
  rooms: [
    "Room inventory",
    "Manage room types, rates, capacity, and amenities.",
  ],
  bookings: ["Reservations", "Review guests and update every stay."],
  gallery: ["Media library", "Curate the images guests see on your website."],
  content: [
    "Website content",
    "Keep your public gallery messaging up to date.",
  ],
  settings: [
    "Hotel settings",
    "Manage identity, contacts, location, social profiles, and booking display.",
  ],
};

const Admin = () => {
  const [token, setToken] = useState(
    localStorage.getItem("peniel_admin_token"),
  );
  const [login, setLogin] = useState({ username: "", password: "" });
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({
    summary: {},
    rooms: [],
    bookings: [],
    gallery: [],
    content: {},
  });
  const [room, setRoom] = useState(emptyRoom);
  const [message, setMessage] = useState("");
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [roomModal, setRoomModal] = useState(false);
  const load = useCallback(async () => {
    try {
      const [summary, rooms, bookings, gallery, content] = await Promise.all([
        api("/api/admin/summary"),
        api("/api/admin/rooms"),
        api("/api/admin/bookings"),
        api("/api/admin/gallery"),
        api("/api/content"),
      ]);
      setData({ summary, rooms, bookings, gallery, content });
    } catch (e) {
      if (e.message.includes("sign-in")) {
        localStorage.removeItem("peniel_admin_token");
        setToken(null);
      }
      setMessage(e.message);
    }
  }, []);
  useEffect(() => {
    if (token) load();
  }, [token, load]);
  const signIn = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      localStorage.setItem("peniel_admin_token", r.token);
      setToken(r.token);
      setMessage("");
    } catch (x) {
      setMessage(x.message);
    } finally {
      setBusy(false);
    }
  };
  const upload = async (file) => {
    const form = new FormData();
    form.append("media", file);
    return (await api("/api/admin/upload", { method: "POST", body: form })).url;
  };
  const saveRoom = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...room,
        price: Number(room.price),
        maxPerson: Number(room.maxPerson),
        facilities:
          typeof room.facilities === "string"
            ? room.facilities
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : room.facilities.map((x) => x.name || x),
      };
      await api(room.id ? `/api/admin/rooms/${room.id}` : "/api/admin/rooms", {
        method: room.id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setRoom(emptyRoom);
      setRoomModal(false);
      setMessage("Room saved successfully.");
      await load();
    } catch (x) {
      setMessage(x.message);
    } finally {
      setBusy(false);
    }
  };
  const requestDelete = (type, id, name) =>
    setPendingDelete({ type, id, name });
  const changePaymentStatus = async (id, paymentStatus) => {
    try {
      const result = await api(`/api/admin/bookings/${id}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus }),
      });
      setMessage(
        result.emailQueued
          ? `Payment marked ${paymentStatus}; guest email queued.`
          : `Payment marked ${paymentStatus}. Gmail is not configured, so no email was sent.`,
      );
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await api(`/api/admin/${pendingDelete.type}/${pendingDelete.id}`, {
        method: "DELETE",
      });
      setMessage(`${pendingDelete.name} was deleted.`);
      setPendingDelete(null);
      await load();
    } catch (x) {
      setMessage(x.message);
    } finally {
      setBusy(false);
    }
  };
  const choose = (name) => {
    setTab(name);
    setMenu(false);
    setMessage("");
  };
  const logout = () => {
    localStorage.removeItem("peniel_admin_token");
    setToken(null);
  };
  if (!token)
    return (
      <main className="min-h-screen bg-[#0e1b18] grid lg:grid-cols-2">
        <div className="hidden lg:flex relative overflow-hidden bg-[url('./assets/img/banner/front-view.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-[#0e1b18]/60" />
          <div className="relative text-white p-16 mt-auto">
            <p className="uppercase tracking-[.35em] text-accent">
              Peniel Beach Hotel
            </p>
            <h1 className="font-primary text-6xl mt-3">
              Hospitality,
              <br />
              beautifully managed.
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <form onSubmit={signIn} className="w-full max-w-md text-white">
            <div className="w-12 h-12 bg-accent grid place-items-center font-primary text-2xl mb-8">
              P
            </div>
            <p className="text-accent uppercase tracking-[.3em] text-xs">
              Secure administration
            </p>
            <h2 className="font-primary text-5xl my-3">Welcome back</h2>
            <p className="text-white/60 mb-10">
              Sign in to manage rooms, reservations and your website.
            </p>
            <label className="block text-sm mb-2">Username</label>
            <input
              className="admin-dark-input"
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
              required
            />
            <label className="block text-sm mb-2 mt-5">Password</label>
            <input
              className="admin-dark-input"
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
            {message && <p className="text-red-300 mt-4">{message}</p>}
            <button
              disabled={busy}
              className="w-full bg-accent hover:bg-accent-hover py-4 uppercase tracking-[.2em] text-sm mt-8"
            >
              {busy ? "Signing in…" : "Sign in to dashboard"}
            </button>
          </form>
        </div>
      </main>
    );

  return (
    <div className="min-h-screen bg-[#f4f6f5] text-[#17211f]">
      <aside
        className={`fixed inset-y-0 left-0 z-[80] w-72 bg-[#10211d] text-white transition-transform lg:translate-x-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-24 px-7 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-accent grid place-items-center font-primary text-xl">
              P
            </span>
            <div>
              <strong className="font-primary text-lg block">Peniel</strong>
              <small className="text-white/50 uppercase tracking-widest">
                Hotel Admin
              </small>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setMenu(false)}>
            <HiOutlineX size={24} />
          </button>
        </div>
        <nav className="p-4 mt-4 space-y-1">
          {navigation.map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => choose(key)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg text-left transition ${tab === key ? "bg-accent text-white shadow-lg" : "text-white/65 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={21} />
              <span>{label}</span>
              {key === "bookings" && data.summary.pending > 0 && (
                <small className="ml-auto bg-white/15 rounded-full px-2 py-0.5">
                  {data.summary.pending}
                </small>
              )}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-5 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-white/60 hover:text-white px-3 py-2"
          >
            <HiOutlineLogout size={21} />
            Sign out
          </button>
        </div>
      </aside>
      {menu && (
        <button
          className="fixed inset-0 bg-black/40 z-[70] lg:hidden"
          onClick={() => setMenu(false)}
          aria-label="Close menu"
        />
      )}
      <div className="lg:ml-72">
        <header className="h-20 bg-white border-b flex items-center justify-between px-5 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setMenu(true)}>
              <HiOutlineMenu size={26} />
            </button>
            <div>
              <h1 className="font-semibold text-lg">{labels[tab][0]}</h1>
              <p className="hidden md:block text-sm text-gray-500">
                {labels[tab][1]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <strong className="text-sm block">Hotel Administrator</strong>
              <small className="text-gray-500">Full access</small>
            </div>
            <span className="w-10 h-10 rounded-full bg-[#e6d7c3] text-accent grid place-items-center font-semibold">
              A
            </span>
          </div>
        </header>
        <main className="p-5 lg:p-10 max-w-[1500px] mx-auto">
          {message && (
            <div className="bg-white border-l-4 border-accent p-4 mb-6 shadow-sm flex justify-between">
              <span>{message}</span>
              <button onClick={() => setMessage("")}>×</button>
            </div>
          )}
          {tab === "overview" && (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5">
                {[
                  ["Rooms", data.summary.rooms, HiOutlineOfficeBuilding],
                  ["All bookings", data.summary.bookings, HiOutlineCalendar],
                  ["Pending", data.summary.pending, HiOutlineClock],
                  ["Gallery", data.summary.gallery, HiOutlinePhotograph],
                  [
                    "Revenue",
                    `$${Number(data.summary.revenue || 0).toLocaleString()}`,
                    HiOutlineCurrencyDollar,
                  ],
                ].map(([label, value, Icon]) => (
                  <article key={label} className="admin-card p-6">
                    <div className="flex justify-between">
                      <span className="w-11 h-11 rounded-lg bg-[#f1e8dc] text-accent grid place-items-center">
                        <Icon size={23} />
                      </span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                    <strong className="text-3xl block mt-6">
                      {value || 0}
                    </strong>
                    <p className="text-gray-500 text-sm mt-1">{label}</p>
                  </article>
                ))}
              </div>
              <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6 mt-7">
                <section className="admin-card">
                  <div className="p-6 border-b flex justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">
                        Recent reservations
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Latest booking activity
                      </p>
                    </div>
                    <button
                      onClick={() => choose("bookings")}
                      className="text-accent text-sm"
                    >
                      View all
                    </button>
                  </div>
                  <BookingTable
                    bookings={data.bookings.slice(0, 5)}
                    compact
                    onPayment={changePaymentStatus}
                    onStatus={async (id, status) => {
                      await api(`/api/admin/bookings/${id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ status }),
                      });
                      load();
                    }}
                  />
                </section>
                <section className="admin-card p-6">
                  <h2 className="font-semibold text-lg">Quick actions</h2>
                  <p className="text-gray-500 text-sm mb-5">
                    Common management tasks
                  </p>
                  {[
                    ["Add a new room", "rooms", HiOutlinePlus],
                    ["Review pending bookings", "bookings", HiOutlineCalendar],
                    ["Upload gallery photos", "gallery", HiOutlinePhotograph],
                  ].map(([label, key, Icon]) => (
                    <button
                      key={key}
                      onClick={() => {
                        choose(key);
                        if (key === "rooms") {
                          setRoom(emptyRoom);
                          setRoomModal(true);
                        }
                      }}
                      className="w-full border rounded-lg p-4 mb-3 flex items-center gap-3 hover:border-accent hover:bg-[#faf8f4]"
                    >
                      <Icon className="text-accent" size={21} />
                      {label}
                    </button>
                  ))}
                </section>
              </div>
            </>
          )}
          {tab === "rooms" && (
            <div>
              {roomModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8">
                  <button
                    type="button"
                    className="absolute inset-0 bg-[#07100e]/70 backdrop-blur-sm"
                    onClick={() => !busy && setRoomModal(false)}
                    aria-label="Close room form"
                  />
                  <form
                    onSubmit={saveRoom}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 lg:p-8"
                  >
                    <button
                      type="button"
                      onClick={() => !busy && setRoomModal(false)}
                      className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gray-100 grid place-items-center hover:bg-gray-200"
                      aria-label="Close room form"
                    >
                      <HiOutlineX size={22} />
                    </button>
                    <h2 className="font-semibold text-xl">
                      {room.id ? "Edit room" : "Create room"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Guest-facing room information
                    </p>
                    {[
                      ["name", "Room name", "text"],
                      ["description", "Description", "text"],
                      ["size", "Size (m²)", "text"],
                      ["maxPerson", "Maximum guests", "number"],
                      ["price", "Nightly price ($)", "number"],
                      ["facilities", "Facilities (comma separated)", "text"],
                    ].map(([key, label, type]) => (
                      <label className="block mb-4" key={key}>
                        <span className="admin-label">{label}</span>
                        <input
                          className="admin-input"
                          type={type}
                          value={
                            Array.isArray(room[key])
                              ? room[key].map((x) => x.name || x).join(", ")
                              : room[key]
                          }
                          onChange={(e) =>
                            setRoom({ ...room, [key]: e.target.value })
                          }
                          required
                        />
                      </label>
                    ))}
                    <label className="block border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-accent">
                      <HiOutlinePhotograph
                        size={28}
                        className="mx-auto text-accent"
                      />
                      <span className="block text-sm mt-2">
                        Upload room photos
                      </span>
                      <small className="text-gray-400">
                        Select several images at once
                      </small>
                      <input
                        hidden
                        type="file"
                        accept="image/*,video/mp4,video/webm,video/quicktime"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;
                          setBusy(true);
                          try {
                            const urls = await Promise.all(files.map(upload));
                            setRoom((r) => ({
                              ...r,
                              image: r.image || urls[0],
                              imageLg: r.imageLg || urls[0],
                              images: [...(r.images || []), ...urls],
                            }));
                          } finally {
                            setBusy(false);
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    {(room.images || []).length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {room.images.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className={`relative aspect-square border-2 rounded overflow-hidden ${room.image === src ? "border-accent" : "border-transparent"}`}
                          >
                            {isVideo(src) ? (
                              <video
                                src={imageUrl(src)}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <img
                                src={imageUrl(src)}
                                alt={`Room upload ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setRoom((r) => ({
                                  ...r,
                                  image: src,
                                  imageLg: src,
                                }))
                              }
                              className="absolute inset-x-1 bottom-1 bg-black/70 text-white text-[10px] py-1 rounded"
                            >
                              {room.image === src ? "Cover" : "Make cover"}
                            </button>
                            <button
                              type="button"
                              aria-label="Remove image"
                              onClick={() =>
                                setRoom((r) => {
                                  const images = r.images.filter(
                                    (item) => item !== src,
                                  );
                                  const nextCover =
                                    r.image === src ? images[0] || "" : r.image;
                                  return {
                                    ...r,
                                    images,
                                    image: nextCover,
                                    imageLg: nextCover,
                                  };
                                })
                              }
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      disabled={busy}
                      className="w-full bg-[#10211d] text-white py-3.5 rounded-lg mt-5"
                    >
                      {busy ? "Saving…" : "Save room"}
                    </button>
                    {room.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setRoom(emptyRoom);
                          setRoomModal(false);
                        }}
                        className="w-full py-3 text-gray-500"
                      >
                        Cancel editing
                      </button>
                    )}
                  </form>
                </div>
              )}
              <section>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-gray-500">
                    {data.rooms.length} room types
                  </p>
                  <button
                    onClick={() => {
                      setRoom(emptyRoom);
                      setRoomModal(true);
                    }}
                    className="bg-accent text-white px-4 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    <HiOutlinePlus />
                    New room
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {data.rooms.map((r) => (
                    <article key={r.id} className="admin-card overflow-hidden">
                      <img
                        src={imageUrl(r.image)}
                        alt={r.name}
                        className="w-full h-48 object-cover bg-gray-200"
                      />
                      <div className="p-5">
                        <div className="flex justify-between gap-4">
                          <h3 className="font-semibold text-lg">{r.name}</h3>
                          <strong className="text-accent">
                            ${r.price}
                            <small className="text-gray-400 font-normal">
                              /night
                            </small>
                          </strong>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          <HiOutlineUsers className="inline mr-1" />
                          {r.maxPerson} guests · {r.size}m²
                        </p>
                        <div className="flex gap-4 mt-5 pt-4 border-t">
                          <button
                            onClick={() => {
                              setRoom(r);
                              setRoomModal(true);
                            }}
                            className="text-accent"
                          >
                            Edit details
                          </button>
                          <button
                            onClick={() => requestDelete("rooms", r.id, r.name)}
                            className="text-red-500 ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
          {tab === "bookings" && (
            <section className="admin-card">
              <div className="p-5 border-b">
                <div>
                  <h2 className="font-semibold text-lg">All reservations</h2>
                  <p className="text-gray-500 text-sm">
                    {data.bookings.length} booking records
                  </p>
                </div>
              </div>
              <BookingTable
                bookings={data.bookings}
                onPayment={changePaymentStatus}
                onStatus={async (id, status) => {
                  await api(`/api/admin/bookings/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                  });
                  load();
                }}
              />
            </section>
          )}
          {tab === "gallery" && (
            <>
              <label className="inline-flex items-center gap-2 bg-[#10211d] text-white px-5 py-3 rounded-lg cursor-pointer mb-6">
                <HiOutlinePlus />
                Upload image or video
                <input
                  hidden
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  onChange={async (e) => {
                    if (!e.target.files[0]) return;
                    const url = await upload(e.target.files[0]);
                    const title =
                      window.prompt("Photo title?") || "Peniel Beach Hotel";
                    const category = window.prompt("Category?") || "Hotel";
                    await api("/api/admin/gallery", {
                      method: "POST",
                      body: JSON.stringify({
                        url,
                        title,
                        category,
                        mediaType: isVideo(url) ? "video" : "image",
                      }),
                    });
                    load();
                  }}
                />
              </label>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {data.gallery.map((g) => (
                  <article
                    key={g.id}
                    className="admin-card overflow-hidden group"
                  >
                    <div className="relative">
                      {g.mediaType === "video" || isVideo(g.url) ? (
                        <video
                          src={imageUrl(g.url)}
                          className="h-60 w-full object-cover"
                          controls
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={imageUrl(g.url)}
                          alt={g.title}
                          className="h-60 w-full object-cover"
                        />
                      )}
                      <button
                        onClick={() => requestDelete("gallery", g.id, g.title)}
                        className="absolute top-3 right-3 bg-white/90 text-red-600 px-3 py-2 rounded opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="p-4">
                      <small className="text-accent uppercase tracking-wider">
                        {g.category}
                      </small>
                      <h3 className="font-semibold">{g.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {tab === "content" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await api("/api/admin/content", {
                  method: "PUT",
                  body: JSON.stringify(data.content),
                });
                setMessage("Website content published.");
              }}
              className="admin-card max-w-3xl p-7"
            >
              <h2 className="font-semibold text-xl">Gallery section</h2>
              <p className="text-gray-500 text-sm mb-7">
                This copy appears above the public photo gallery.
              </p>
              {[
                ["galleryEyebrow", "Eyebrow"],
                ["galleryTitle", "Main heading"],
                ["galleryIntro", "Introduction"],
              ].map(([key, label]) => (
                <label className="block mb-5" key={key}>
                  <span className="admin-label">{label}</span>
                  <textarea
                    rows={key === "galleryIntro" ? 4 : 2}
                    className="admin-input"
                    value={data.content[key] || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        content: { ...data.content, [key]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <button className="bg-accent text-white px-6 py-3 rounded-lg">
                Publish changes
              </button>
            </form>
          )}
          {tab === "settings" && (
            <SettingsForm
              values={data.content}
              onChange={(key, value) =>
                setData({ ...data, content: { ...data.content, [key]: value } })
              }
              onSave={async (e) => {
                e.preventDefault();
                setBusy(true);
                try {
                  await api("/api/admin/content", {
                    method: "PUT",
                    body: JSON.stringify(data.content),
                  });
                  setMessage(
                    "Hotel settings saved. Refresh the public site to see the changes.",
                  );
                } catch (x) {
                  setMessage(x.message);
                } finally {
                  setBusy(false);
                }
              }}
              busy={busy}
            />
          )}
        </main>
      </div>
      {pendingDelete && (
        <DeleteModal
          item={pendingDelete}
          busy={busy}
          onCancel={() => !busy && setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

const DeleteModal = ({ item, busy, onCancel, onConfirm }) => (
  <div
    className="fixed inset-0 z-[120] flex items-center justify-center p-5"
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-title"
  >
    <button
      className="absolute inset-0 bg-[#07100e]/70 backdrop-blur-sm"
      onClick={onCancel}
      aria-label="Close confirmation"
    />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="p-7">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 grid place-items-center mb-5">
          <HiOutlineX size={28} />
        </div>
        <h2 id="delete-title" className="text-2xl font-semibold">
          Delete {item.type === "rooms" ? "room" : "photo"}?
        </h2>
        <p className="text-gray-500 mt-3 leading-6">
          You are about to permanently delete{" "}
          <strong className="text-gray-800">{item.name}</strong>. This action
          cannot be undone.
        </p>
      </div>
      <div className="bg-gray-50 border-t px-7 py-5 flex justify-end gap-3">
        <button
          disabled={busy}
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          disabled={busy}
          onClick={onConfirm}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  </div>
);

const SettingsForm = ({ values, onChange, onSave, busy }) => {
  const groups = [
    [
      "Hotel identity",
      [
        ["hotelName", "Hotel name"],
        ["tagline", "Short tagline"],
        ["currencySymbol", "Currency symbol"],
        ["currencyCode", "Payment currency code (e.g. USD)"],
        ["paymentEnabled", "Accept online card payments"],
        ["heroTitle", "Homepage hero heading"],
        ["heroButtonText", "Hero button text"],
        ["aboutText", "About the hotel"],
        ["cancellationPolicy", "Cancellation and refund policy"],
        ["bookingTerms", "General booking and stay terms"],
      ],
    ],
    [
      "Contact and location",
      [
        ["addressLine1", "Address line 1"],
        ["addressLine2", "Address line 2"],
        ["country", "Country"],
        ["primaryPhone", "Primary phone"],
        ["secondaryPhone", "Secondary phone"],
        ["whatsapp", "WhatsApp number"],
        ["email", "Public email"],
        ["mapEmbedUrl", "Google Maps embed URL"],
      ],
    ],
    [
      "Social media",
      [
        ["instagram", "Instagram URL"],
        ["facebook", "Facebook URL"],
        ["twitter", "X / Twitter URL"],
      ],
    ],
  ];
  return (
    <form onSubmit={onSave} className="max-w-4xl space-y-6">
      {groups.map(([title, fields]) => (
        <section className="admin-card p-7" key={title}>
          <h2 className="font-semibold text-xl">{title}</h2>
          <p className="text-gray-500 text-sm mb-6">
            Changes are stored in MySQL and used across the public website.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {fields.map(([key, label]) => (
              <label
                className={
                  [
                    "aboutText",
                    "mapEmbedUrl",
                    "cancellationPolicy",
                    "bookingTerms",
                  ].includes(key)
                    ? "md:col-span-2"
                    : ""
                }
                key={key}
              >
                <span className="admin-label">{label}</span>
                {key === "paymentEnabled" ? (
                  <span className="flex items-center justify-between border rounded-xl p-4 bg-gray-50">
                    <span>
                      <strong className="block text-sm">
                        {values[key] !== "false"
                          ? "Payments active"
                          : "Payments paused"}
                      </strong>
                      <small className="text-gray-500">
                        {values[key] !== "false"
                          ? "Guests pay by card during booking."
                          : "Bookings arrive as unpaid requests."}
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      className="w-6 h-6 accent-[#a37d4c]"
                      checked={values[key] !== "false"}
                      onChange={(e) => onChange(key, String(e.target.checked))}
                    />
                  </span>
                ) : [
                    "aboutText",
                    "mapEmbedUrl",
                    "cancellationPolicy",
                    "bookingTerms",
                  ].includes(key) ? (
                  <textarea
                    rows={key === "aboutText" ? 4 : 3}
                    className="admin-input"
                    value={values[key] || ""}
                    onChange={(e) => onChange(key, e.target.value)}
                  />
                ) : (
                  <input
                    type={key === "email" ? "email" : "text"}
                    className="admin-input"
                    value={values[key] || ""}
                    onChange={(e) => onChange(key, e.target.value)}
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky bottom-5 bg-white border rounded-xl p-4 shadow-lg flex items-center justify-between">
        <p className="text-sm text-gray-500 hidden sm:block">
          Review the details before publishing.
        </p>
        <button
          disabled={busy}
          className="bg-accent text-white px-7 py-3 rounded-lg ml-auto"
        >
          {busy ? "Saving…" : "Save all settings"}
        </button>
      </div>
    </form>
  );
};

const BookingTable = ({ bookings, onStatus, onPayment }) => {
  const columns = [
    {
      key: "reservationCode",
      name: "Code",
      selector: (b) => b.reservationCode || b.paymentReference || "—",
      cell: (b) => (
        <strong className="text-accent whitespace-nowrap">
          {b.reservationCode || b.paymentReference || "—"}
        </strong>
      ),
    },
    {
      key: "names",
      name: "Guest",
      selector: (b) => b.names,
      searchValue: (b) => `${b.names} ${b.email}`,
      cell: (b) => (
        <>
          <strong className="block whitespace-nowrap">{b.names}</strong>
          <small className="text-gray-500">{b.email}</small>
        </>
      ),
    },
    {
      key: "checkIn",
      name: "Stay",
      selector: (b) => b.checkIn,
      cell: (b) => (
        <span className="text-sm whitespace-nowrap">
          {new Date(b.checkIn).toLocaleDateString()}
          <small className="text-gray-400 block">
            to {new Date(b.checkOut).toLocaleDateString()}
          </small>
        </span>
      ),
    },
    { key: "type", name: "Room", selector: (b) => b.type },
    {
      key: "price",
      name: "Amount",
      selector: (b) => Number(b.price || 0),
      cell: (b) => (
        <strong>
          {b.currency || "$"} {Number(b.price || 0).toLocaleString()}
        </strong>
      ),
    },
    {
      key: "paymentStatus",
      name: "Payment",
      selector: (b) => b.paymentStatus || "unpaid",
      sortable: false,
      cell: (b) => (
        <select
          value={b.paymentStatus || "unpaid"}
          onChange={(e) => onPayment(b.id, e.target.value)}
          className={`status-select ${b.paymentStatus === "paid" ? "status-completed" : b.paymentStatus === "failed" ? "status-cancelled" : "status-pending"}`}
        >
          {["unpaid", "pending", "paid", "failed", "refunded"].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      ),
    },
    {
      key: "status",
      name: "Status",
      selector: (b) => b.status,
      sortable: false,
      cell: (b) => (
        <select
          value={b.status}
          onChange={(e) => onStatus(b.id, e.target.value)}
          className={`status-select status-${b.status}`}
        >
          {["pending", "confirmed", "checked-in", "completed", "cancelled"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
      ),
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={bookings}
      searchPlaceholder="Search code, guest, email, or room"
      emptyMessage="No reservations found."
    />
  );
};
export default Admin;
