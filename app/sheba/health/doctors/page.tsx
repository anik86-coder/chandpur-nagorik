"use client";



import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@/firebase";



const DEFAULT_DEPARTMENTS = [

  "মেডিসিন", "গাইনি ও প্রসূতি", "শিশু", "চক্ষু", "চর্ম ও যৌন", "কার্ডিওলজি", "ENT",

  "অর্থোপেডিক্স", "নিউরোলজি", "নেফ্রোলজি", "ইউরোলজি", "গ্যাস্ট্রোএন্টেরোলজি", "সার্জারি",

  "ডেন্টাল", "মানসিক রোগ", "ফিজিওথেরাপি", "কিডনি", "লিভার", "অন্যান্য",

];



type Chamber = {

  name: string;

  address?: string;

  url?: string;

  schedule?: string;

  days?: string;

  // Legacy support for the old hard-coded page shape.

  slug?: string;

};



type DoctorRecord = {

  id: string;

  doctorId?: string;

  name?: string;

  specialty?: string;

  degrees?: string;

  designation?: string;

  degree?: string;

  department?: string;

  workplace?: string;

  hospital?: string;

  address?: string;

  chambers?: Chamber[];

  chamber?: string;

  phone?: string;

  fee?: string;

  experience?: string;

  bio?: string;

  imageUrl?: string;

  image?: string;

  verified?: boolean;

  appointmentEnabled?: boolean;

  appointmentUrl?: string;

  published?: boolean;

};



function getDepartment(doctor: DoctorRecord): string {

  if (doctor.department) return doctor.department;

  const text = `${doctor.specialty || ""} ${doctor.degrees || doctor.degree || ""}`.toLowerCase();

  if (/গাইনি|প্রসূতি|gynae|obstetric/.test(text)) return "গাইনি ও প্রসূতি";

  if (/শিশু|pediatric|paediatric|child/.test(text)) return "শিশু";

  if (/চক্ষু|eye|ophthalm/.test(text)) return "চক্ষু";

  if (/চর্ম|যৌন|derma|skin/.test(text)) return "চর্ম ও যৌন";

  if (/হৃদ|কার্ডিও|cardio|heart/.test(text)) return "কার্ডিওলজি";

  if (/নাক|কান|গলা|\bent\b|otorhino/.test(text)) return "ENT";

  if (/অর্থো|হাড়|জোড়|ortho/.test(text)) return "অর্থোপেডিক্স";

  if (/নিউরো|স্নায়ু|neuro/.test(text)) return "নিউরোলজি";

  if (/নেফ্রো|কিডনি|nephro|kidney/.test(text)) return /নেফ্রো|nephro/.test(text) ? "নেফ্রোলজি" : "কিডনি";

  if (/ইউরো|uro/.test(text)) return "ইউরোলজি";

  if (/গ্যাস্ট্রো|পাকস্থলী|gastro/.test(text)) return "গ্যাস্ট্রোএন্টেরোলজি";

  if (/সার্জারি|সার্জন|surgeon|surgery/.test(text)) return "সার্জারি";

  if (/ডেন্টাল|দাঁত|dental/.test(text)) return "ডেন্টাল";

  if (/মানসিক|psychiat/.test(text)) return "মানসিক রোগ";

  if (/ফিজিও|physio/.test(text)) return "ফিজিওথেরাপি";

  if (/লিভার|hepat|liver/.test(text)) return "লিভার";

  if (/মেডিসিন|medicine|physician/.test(text)) return "মেডিসিন";

  return "অন্যান্য";

}



function getChambers(doctor: DoctorRecord): Chamber[] {

  if (Array.isArray(doctor.chambers) && doctor.chambers.length) {

    return doctor.chambers

      .filter((chamber) => chamber && (chamber.name || chamber.address || chamber.url || chamber.slug))

      .map((chamber) => ({

        name: chamber.name || "চেম্বার",

        address: chamber.address || "",

        url: chamber.url || (chamber.slug ? `/sheba/health/hospitals/${chamber.slug}` : ""),

        schedule: chamber.schedule || "",

        days: chamber.days || "",

      }));

  }

  if (doctor.chamber) {

    return [{ name: doctor.chamber, address: doctor.address || "", url: "", schedule: "", days: "" }];

  }

  return [];

}



function getDoctorImage(doctor: DoctorRecord): string {

  return doctor.imageUrl || doctor.image || "/profile/anik-pic.svg";

}



function isExternalUrl(url: string): boolean {

  return /^https?:\/\//i.test(url);

}



export default function DoctorsPage() {

  const [selectedDepartment, setSelectedDepartment] = useState("সব ডাক্তার");
  const [departmentPreferenceLoaded, setDepartmentPreferenceLoaded] = useState(false);

  const [search, setSearch] = useState("");

  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);

  const [departments, setDepartments] = useState<string[]>(["সব ডাক্তার", ...DEFAULT_DEPARTMENTS]);

  const hiddenDepartmentsRef = useRef<string[]>([]);

  const departmentSourceRef = useRef<string[]>(DEFAULT_DEPARTMENTS);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [verifyingDoctor, setVerifyingDoctor] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 15;

  // Restore the selected department after refresh, then keep it saved.
  useEffect(() => {
    try {
      const savedDepartment = window.localStorage.getItem("chandpur-nagorik-doctors-department");
      if (savedDepartment) setSelectedDepartment(savedDepartment);
    } catch (error) {
      console.error("Could not restore selected doctor department:", error);
    } finally {
      setDepartmentPreferenceLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!departmentPreferenceLoaded) return;
    try {
      window.localStorage.setItem("chandpur-nagorik-doctors-department", selectedDepartment);
    } catch (error) {
      console.error("Could not save selected doctor department:", error);
    }
  }, [selectedDepartment, departmentPreferenceLoaded]);



  useEffect(() => {

    const doctorsQuery = query(collection(db, "doctors"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(

      doctorsQuery,

      (snapshot) => {

        const records = snapshot.docs.map((item) => ({

          id: item.id,

          ...item.data(),

        })) as DoctorRecord[];

        // Only explicitly published doctors are public. Legacy records without

        // the field remain hidden until an admin publishes them.

        setDoctors(records.filter((doctor) => doctor.published === true));

        setLoadError("");

        setLoading(false);

      },

      (error) => {

        console.error("Public doctors loading error:", error);

        setLoadError("ডাক্তারের তথ্য এখন লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।");

        setLoading(false);

      }

    );

    const unsubscribeDepartments = onSnapshot(

      collection(db, "doctorDepartments"),

      (snapshot) => {

        const custom = snapshot.docs.map((item) => String(item.data().name || "").trim()).filter(Boolean);

        departmentSourceRef.current = Array.from(new Set([...DEFAULT_DEPARTMENTS, ...custom]));

        setDepartments((current) => {

          const names = new Set(departmentSourceRef.current);

          return ["সব ডাক্তার", ...Array.from(names).filter((name) => !hiddenDepartmentsRef.current.includes(name)).sort((a, b) => {

            const ai = DEFAULT_DEPARTMENTS.indexOf(a);

            const bi = DEFAULT_DEPARTMENTS.indexOf(b);

            if (ai !== -1 && bi !== -1) return ai - bi;

            if (ai !== -1) return -1;

            if (bi !== -1) return 1;

            return a.localeCompare(b, "bn");

          })];

        });

      },

      (error) => console.error("Public department loading error:", error)

    );

    const unsubscribeHidden = onSnapshot(

      collection(db, "doctorDepartmentHidden"),

      (snapshot) => {

        const hidden = snapshot.docs.map((item) => String(item.data().name || "").trim()).filter(Boolean);

        hiddenDepartmentsRef.current = hidden;

        setDepartments(["সব ডাক্তার", ...departmentSourceRef.current.filter((name) => !hidden.includes(name)).sort((a, b) => {

          const ai = DEFAULT_DEPARTMENTS.indexOf(a);

          const bi = DEFAULT_DEPARTMENTS.indexOf(b);

          if (ai !== -1 && bi !== -1) return ai - bi;

          if (ai !== -1) return -1;

          if (bi !== -1) return 1;

          return a.localeCompare(b, "bn");

        })]);

      },

      (error) => console.error("Public hidden department loading error:", error)

    );

    return () => {

      unsubscribe();

      unsubscribeDepartments();

      unsubscribeHidden();

    };

  }, []);



  const filteredDoctors = useMemo(() => {

    const term = search.trim().toLocaleLowerCase();

    return doctors.filter((doctor) => {

      const departmentMatches =

        selectedDepartment === "সব ডাক্তার" || getDepartment(doctor) === selectedDepartment;

      if (!departmentMatches) return false;

      if (!term) return true;

      const chambers = getChambers(doctor);

      const searchable = [

        doctor.doctorId, doctor.name, doctor.specialty, doctor.degrees, doctor.degree,

        doctor.workplace, doctor.hospital, doctor.address, doctor.phone, doctor.fee,

        ...chambers.flatMap((chamber) => [chamber.name, chamber.address, chamber.url, chamber.schedule, chamber.days]),

      ];

      return searchable.some((value) => value?.toLocaleLowerCase().includes(term));

    });

  }, [doctors, departments, selectedDepartment, search]);



  // Show 15 doctor cards per page.

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / PAGE_SIZE));

  const paginatedDoctors = useMemo(() => {

    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredDoctors.slice(start, start + PAGE_SIZE);

  }, [filteredDoctors, currentPage]);



  // Return to the first page whenever the filter or search changes.

  useEffect(() => {

    setCurrentPage(1);

  }, [selectedDepartment, search]);



  // Keep the page valid if doctors are added or removed.

  useEffect(() => {

    if (currentPage > totalPages) setCurrentPage(totalPages);

  }, [currentPage, totalPages]);



  const doctorsSchema = useMemo(() => ({

    "@context": "https://schema.org",

    "@type": "ItemList",

    name: "চাঁদপুর ডাক্তার পয়েন্ট",

    description: "চাঁদপুরের বিভিন্ন চিকিৎসা বিভাগের ডাক্তারদের তালিকা, বিশেষজ্ঞতা, ডিগ্রি, হাসপাতাল ও চেম্বারের তথ্য।",

    url: "https://chandpurnagorik.com/sheba/health/doctors",

    numberOfItems: filteredDoctors.length,

    itemListElement: filteredDoctors.map((doctor, index) => ({

      "@type": "ListItem",

      position: index + 1,

      item: {

        "@type": "Physician",

        name: doctor.name || "",

        identifier: doctor.doctorId || undefined,

        medicalSpecialty: doctor.specialty || "",

        description: `${doctor.name || ""} - ${doctor.specialty || ""}. ${doctor.degrees || doctor.degree || ""}`,

        image: getDoctorImage(doctor).startsWith("http")

          ? getDoctorImage(doctor)

          : `https://chandpurnagorik.com${getDoctorImage(doctor)}`,

      },

    })),

  }), [filteredDoctors]);



  const breadcrumbSchema = {

    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [

      { "@type": "ListItem", position: 1, name: "চাঁদপুর নাগরিক", item: "https://chandpurnagorik.com/" },

      { "@type": "ListItem", position: 2, name: "স্বাস্থ্যসেবা", item: "https://chandpurnagorik.com/sheba/health" },

      { "@type": "ListItem", position: 3, name: "ডাক্তার পয়েন্ট", item: "https://chandpurnagorik.com/sheba/health/doctors" },

    ],

  };



  return (

    <>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorsSchema) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />



      <main className="min-h-[calc(100vh-75px)] bg-gray-50 font-[Kalpurush] sm:min-h-[calc(100vh-85px)]">

        <div className="mx-auto max-w-screen-xl px-4 py-6 md:py-10">

          <section className="rounded-2xl bg-[#116cb4] p-4 text-white shadow-md md:p-6" aria-labelledby="doctor-department-title">

            <div className="mb-4 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 md:mb-5 md:gap-4">

              <Link

                href="/sheba/health"

                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-2.5 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-3 sm:text-sm"

                aria-label="স্বাস্থ্যসেবা পেজে ফিরে যান"

              >

                <span aria-hidden="true">←</span>

                <span>পেছনে যান</span>

              </Link>

              <div className="min-w-0 text-center">

                <h1 id="doctor-department-title" className="text-lg font-extrabold md:text-xl">চাঁদপুর ডাক্তার পয়েন্ট</h1>

                <p className="mt-1 text-xs text-white/80 md:text-sm">আপনার প্রয়োজনীয় চিকিৎসা বিভাগের ডাক্তার খুঁজুন</p>

              </div>

            </div>

            <label htmlFor="doctor-search" className="sr-only">ডাক্তারের নাম, ID, ডিগ্রি বা হাসপাতাল দিয়ে খুঁজুন</label>

            <input

              id="doctor-search"

              type="search"

              value={search}

              onChange={(event) => setSearch(event.target.value)}

              placeholder="ডাক্তারের নাম, ৮ ডিজিটের ID, ডিগ্রি, হাসপাতাল বা এলাকা দিয়ে খুঁজুন..."

              className="mb-4 w-full rounded-xl border border-white/30 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-orange-300"

            />

            <div className="flex flex-wrap justify-center gap-2 md:gap-3" aria-label="চিকিৎসা বিভাগ নির্বাচন">

              {departments.map((department) => {

                const active = selectedDepartment === department;

                return (

                  <button

                    key={department}

                    type="button"

                    onClick={() => setSelectedDepartment(department)}

                    aria-pressed={active}

                    className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 md:px-5 md:py-2.5 md:text-sm ${

                      active

                        ? "scale-[1.02] border-white bg-white text-[#116cb4] shadow-md"

                        : "border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"

                    }`}

                  >

                    {department}

                  </button>

                );

              })}

            </div>

          </section>



          <div className="mt-6 flex items-center justify-between gap-3">

            <div>

              <h2 className="text-lg font-bold text-gray-800 md:text-xl">{selectedDepartment}</h2>

              <p className="mt-1 text-xs text-gray-500 md:text-sm">{loading ? "তথ্য লোড হচ্ছে..." : `${filteredDoctors.length} জন ডাক্তার পাওয়া গেছে`}</p>

            </div>

            {selectedDepartment !== "সব ডাক্তার" && (

              <button type="button" onClick={() => setSelectedDepartment("সব ডাক্তার")} className="text-xs font-bold text-[#116cb4] hover:underline md:text-sm">

                সব ডাক্তার দেখুন

              </button>

            )}

          </div>



          {loadError && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div>}



          <section className="mt-4 md:mt-5" aria-labelledby="doctor-list-title">

            <h2 id="doctor-list-title" className="sr-only">চাঁদপুরের ডাক্তারদের তালিকা</h2>

            {loading ? (

              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">ডাক্তারের তথ্য লোড হচ্ছে...</div>

            ) : filteredDoctors.length > 0 ? (

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">

                {paginatedDoctors.map((doctor) => {

                  const chambers = getChambers(doctor);

                  const image = getDoctorImage(doctor);

                  const name = doctor.name || "নাম দেওয়া হয়নি";

                  return (

                    <article key={doctor.id} className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_5px_22px_rgba(15,63,105,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(15,63,105,0.12)] sm:p-4">

                      {/* Top section: photo on the left, doctor identity on the right */}

                      <div className="grid grid-cols-[112px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">

                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-sm">

                          <img src={image} alt={`${name} - ${doctor.specialty || "ডাক্তার"}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />

                          <div className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-md bg-slate-950/45 px-1.5 py-1 text-[8px] font-bold text-white/90 sm:text-[9px]">চাঁদপুর নাগরিক</div>

                        </div>



                        <div className="min-w-0 pt-0.5">

                          <h3 className="min-w-0 break-words text-[15px] font-extrabold leading-6 text-slate-900 sm:text-lg sm:leading-7">

                            {name}

                            {doctor.verified && (

                              <span className="relative ml-2 inline-flex align-middle">

                                <button

                                  type="button"

                                  onClick={() => setVerifyingDoctor((current) => current === doctor.id ? null : doctor.id)}

                                  onMouseEnter={() => setVerifyingDoctor(doctor.id)}

                                  onMouseLeave={() => setVerifyingDoctor((current) => current === doctor.id ? null : current)}

                                  onFocus={() => setVerifyingDoctor(doctor.id)}

                                  onBlur={() => setVerifyingDoctor((current) => current === doctor.id ? null : current)}

                                  aria-label={`${name} চাঁদপুর নাগরিক কর্তৃক যাচাইকৃত`}

                                  aria-expanded={verifyingDoctor === doctor.id}

                                  className="relative inline-flex h-[16px] w-[16px] translate-y-[1px] items-center justify-center rounded-full align-middle transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:h-[18px] sm:w-[18px]"

                                >

                                  <img src="/check.png" alt="যাচাইকৃত" className="h-full w-full object-contain" />

                                </button>

                                {verifyingDoctor === doctor.id && (

                                  <span role="status" className="absolute left-1/2 top-full z-30 mt-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-[11px] font-bold leading-4 text-white shadow-lg">

                                    চাঁদপুর নাগরিক কর্তৃক যাচাইকৃত

                                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />

                                  </span>

                                )}

                              </span>

                            )}

                          </h3>

                          {doctor.specialty && <p className="mt-0.5 break-words text-sm font-bold leading-5 text-blue-700 sm:text-[15px]">{doctor.specialty}</p>}

                          {doctor.doctorId && <p className="mt-1 break-all font-mono text-[10px] text-slate-500 sm:text-xs">Doctor ID: {doctor.doctorId}</p>}



                          {(doctor.degrees || doctor.degree) && (

                            <div className="mt-2 flex flex-wrap gap-1.5" aria-label="ডাক্তারের ডিগ্রি">

                              {(doctor.degrees || doctor.degree || "")

                                .split(/[,،，]+/)

                                .map((degree) => degree.trim())

                                .filter(Boolean)

                                .map((degree, degreeIndex) => (

                                  <span key={`${degree}-${degreeIndex}`} className="inline-flex max-w-full items-center rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white px-2 py-1.5 text-[11px] font-extrabold leading-4 text-blue-800 shadow-sm ring-1 ring-blue-100/70 sm:px-2.5 sm:text-xs">

                                    <span className="break-words">{degree}</span>

                                  </span>

                                ))}

                            </div>

                          )}



                          {doctor.designation && (

                            <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-2.5 py-1.5 shadow-sm">

                              <span aria-hidden="true" className="text-sm">🎓</span>

                              <span className="break-words text-xs font-extrabold leading-5 text-orange-800 sm:text-sm">{doctor.designation}</span>

                            </div>

                          )}

                        </div>

                      </div>



                      {/* Workplace and address */}

                      {(doctor.workplace || doctor.hospital || doctor.address) && (

                        <div className="mt-4 flex gap-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3 sm:p-3.5">

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-lg shadow-sm" aria-hidden="true">🏥</span>

                          <div className="min-w-0 flex-1">

                            <p className="text-[11px] font-semibold text-slate-500 sm:text-xs">বর্তমান হাসপাতাল / কর্মস্থল</p>

                            {(doctor.workplace || doctor.hospital) && <p className="mt-0.5 break-words text-sm font-extrabold leading-6 text-slate-900 sm:text-base">{doctor.workplace || doctor.hospital}</p>}

                            {doctor.address && <p className="mt-1 break-words text-xs leading-5 text-slate-600 sm:text-sm">📍 {doctor.address}</p>}

                          </div>

                        </div>

                      )}



                      {/* Chambers */}

                      {chambers.length > 0 && (

                        <div className="mt-4 border-t border-slate-100 pt-3">

                          <div className="mb-2.5 flex items-center gap-2">

                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-sm" aria-hidden="true">🏥</span>

                            <p className="text-sm font-extrabold text-slate-700 sm:text-base">চেম্বার ও রোগী দেখার সময়</p>

                          </div>

                          <div className="flex flex-col gap-2.5">

                            {chambers.map((chamber, index) => {

                              const href = chamber.url || "";

                              const linkClass = "group/chamber flex min-w-0 items-start gap-3 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-cyan-50/40 p-3.5 text-sm shadow-sm transition-all duration-200 hover:border-teal-200 hover:shadow-md sm:p-4";

                              const content = (

                                <>

                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-base shadow-sm" aria-hidden="true">🏥</span>

                                  <span className="min-w-0 flex-1">

                                    <span className="flex flex-wrap items-start gap-2">

                                      <span className="block break-words text-sm font-extrabold leading-6 text-slate-900 sm:text-base">{chamber.name}</span>

                                    </span>

                                    {chamber.address && <span className="mt-1 block break-words text-sm leading-5 text-slate-600">📍 {chamber.address}</span>}

                                    {chamber.days && <span className="mt-2 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-bold leading-5 text-emerald-800 sm:text-sm"><span>📅</span><span>দিন: {chamber.days}</span></span>}

                                    {chamber.schedule && <span className="mt-2 block break-words text-sm font-bold leading-5 text-blue-700 sm:text-base">🕒 সময়: {chamber.schedule}</span>}

                                  </span>

                                  {href && <span className="shrink-0 self-center text-xs font-bold text-blue-700 group-hover/chamber:underline">দেখুন →</span>}

                                </>

                              );

                              if (!href) return <div key={`${chamber.name}-${index}`} className={linkClass}>{content}</div>;

                              if (isExternalUrl(href)) return <a key={`${chamber.name}-${index}`} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>{content}</a>;

                              return <Link key={`${chamber.name}-${index}`} href={href.startsWith("/") ? href : `/sheba/health/hospitals/${href}`} className={linkClass}>{content}</Link>;

                            })}

                          </div>

                        </div>

                      )}



                      {doctor.bio && <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{doctor.bio}</p>}

                      {(doctor.fee || doctor.experience || doctor.phone) && (

                        <div className="mt-3 grid grid-cols-1 gap-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 sm:grid-cols-2">

                          {doctor.fee && <p>💳 ভিজিট ফি: <span className="font-bold text-slate-800">{doctor.fee}</span></p>}

                          {doctor.experience && <p>⭐ অভিজ্ঞতা: <span className="font-bold text-slate-800">{doctor.experience}</span></p>}

                          {doctor.phone && <p className="sm:col-span-2">📞 ফোন: <span className="font-bold text-slate-800">{doctor.phone}</span></p>}

                        </div>

                      )}



                      <div className="mt-auto pt-4">

                        {doctor.appointmentEnabled && doctor.appointmentUrl ? (

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">

                            {isExternalUrl(doctor.appointmentUrl) ? (

                              <a href={doctor.appointmentUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-700 bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-700"><span>📅</span><span>অ্যাপয়েন্টমেন্ট নিন</span></a>

                            ) : (

                              <Link href={doctor.appointmentUrl} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-blue-700 bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:from-blue-800 hover:to-blue-700"><span>📅</span><span>অ্যাপয়েন্টমেন্ট নিন</span></Link>

                            )}

                            {doctor.phone && <a href={`tel:${doctor.phone.replace(/[^+\d]/g, "")}`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"><span>📞</span><span>ফোন করুন</span></a>}

                          </div>

                        ) : (

                          <div className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-500"><span>📅</span><span>অ্যাপয়েন্টমেন্ট (শীঘ্রই চালু হবে)</span></div>

                        )}

                      </div>

                    </article>

                  );

                })}

              </div>

            ) : (

              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                <div className="mb-3 text-4xl" aria-hidden="true">👨‍⚕️</div>

                <h3 className="text-lg font-bold text-gray-800">{search.trim() ? "আপনার সার্চের সঙ্গে মেলে এমন ডাক্তার পাওয়া যায়নি" : "এই বিভাগে এখনো কোনো প্রকাশিত ডাক্তার নেই"}</h3>

                <p className="mt-2 text-sm text-gray-500">অন্য বিভাগ নির্বাচন করুন অথবা সার্চের শব্দ পরিবর্তন করুন।</p>

                {(selectedDepartment !== "সব ডাক্তার" || search) && <button type="button" onClick={() => { setSelectedDepartment("সব ডাক্তার"); setSearch(""); }} className="mt-5 rounded-xl bg-[#116cb4] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0d5b99]">সব ডাক্তার দেখুন</button>}

              </div>

            )}

          </section>



          {/* Pagination: 15 doctors per page */}

          {!loading && filteredDoctors.length > PAGE_SIZE && (

            <nav className="mt-7 flex flex-wrap items-center justify-center gap-2" aria-label="ডাক্তার তালিকার পৃষ্ঠা">

              <button

                type="button"

                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}

                disabled={currentPage === 1}

                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"

              >

                ← আগের

              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (

                <button

                  key={page}

                  type="button"

                  onClick={() => setCurrentPage(page)}

                  aria-current={currentPage === page ? "page" : undefined}

                  className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-extrabold shadow-sm transition ${

                    currentPage === page

                      ? "border-[#116cb4] bg-[#116cb4] text-white"

                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"

                  }`}

                >

                  {page}

                </button>

              ))}

              <button

                type="button"

                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}

                disabled={currentPage === totalPages}

                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"

              >

                পরের →

              </button>

              <p className="w-full pt-1 text-center text-xs text-slate-500">

                পৃষ্ঠা {currentPage} / {totalPages} · মোট {filteredDoctors.length} জন ডাক্তার · প্রতি পৃষ্ঠায় সর্বোচ্চ {PAGE_SIZE} জন

              </p>

            </nav>

          )}



          <section className="mt-6 rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm">

            <p className="text-sm leading-6 text-gray-600"><span className="font-bold text-gray-800">নোট:</span> ডাক্তারদের তথ্য যাচাই করে নিয়মিত আপডেট করা হবে।</p>

          </section>



        </div>

      </main>

    </>

  );

}
