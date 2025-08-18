/* ============ Utilities ============ */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ============ Preloader (5s) ============ */
window.addEventListener("load", () => {
  setTimeout(() => { $("#preloader").style.display = "none"; }, 5000);
});

/* ============ Navbar (mobile + shadow on scroll) ============ */
const menuToggle = $("#menu-toggle");
const navLinks = $("#nav-links");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));

const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 8) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

/* ============ Hero Slider ============ */
const slides = $$(".slide");
const nextBtn = $("#next");
const prevBtn = $("#prev");
let heroIndex = 0;
let heroTimer;

function showHero(i){
  slides.forEach(s => s.classList.remove("active"));
  slides[i].classList.add("active");
}
function nextHero(){
  heroIndex = (heroIndex + 1) % slides.length;
  showHero(heroIndex);
}
function prevHero(){
  heroIndex = (heroIndex - 1 + slides.length) % slides.length;
  showHero(heroIndex);
}
nextBtn.addEventListener("click", () => { nextHero(); resetHeroTimer(); });
prevBtn.addEventListener("click", () => { prevHero(); resetHeroTimer(); });
function startHeroTimer(){ heroTimer = setInterval(nextHero, 5000); }
function resetHeroTimer(){ clearInterval(heroTimer); startHeroTimer(); }
startHeroTimer();

/* ============ Reveal on Scroll ============ */
const revealEls = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
},{ threshold: .15 });
revealEls.forEach(el => io.observe(el));

/* ============ Counters ============ */
const counterEls = $$(".stat-number");
let countersStarted = false;
function animateCounter(el){
  const target = +el.dataset.target;
  const dur = 1400;
  const start = performance.now();
  function step(now){
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.floor(target * p).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}
const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted){
      counterEls.forEach(animateCounter);
      countersStarted = true;
      countersObserver.disconnect();
    }
  });
},{threshold:.35});
counterEls.forEach(el => countersObserver.observe(el));

/* ============ Menu Filters ============ */
const filterBtns = $$(".filter-btn");
const menuItems = $$(".menu-item");
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    menuItems.forEach(item => {
      const show = f === "all" || item.dataset.cat === f;
      item.style.display = show ? "block" : "none";
    });
  });
});

/* ============ Reservation Form (basic validation) ============ */
const form = $("#reservation-form");
const msg = $("#form-msg");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const date = $("#date").value;
  const time = $("#time").value;
  const people = $("#people").value;

  if (!name || !email || !date || !time || !people){
    msg.textContent = "Please fill all fields.";
    msg.className = "form-msg err";
    return;
  }
  msg.textContent = "Reservation received! We’ll email you shortly.";
  msg.className = "form-msg ok";
  form.reset();
});

/* ============ Testimonials Slider ============ */
const tSlides = $$("#testimonial-slider .t-slide");
const tNext = $("#t-next");
const tPrev = $("#t-prev");
let tIndex = 0, tTimer;

function showTestimonial(i){
  tSlides.forEach(s => s.classList.remove("active"));
  tSlides[i].classList.add("active");
}
function nextTestimonial(){
  tIndex = (tIndex + 1) % tSlides.length;
  showTestimonial(tIndex);
}
function prevTestimonial(){
  tIndex = (tIndex - 1 + tSlides.length) % tSlides.length;
  showTestimonial(tIndex);
}
tNext.addEventListener("click", () => { nextTestimonial(); resetTTimer(); });
tPrev.addEventListener("click", () => { prevTestimonial(); resetTTimer(); });
function startTTimer(){ tTimer = setInterval(nextTestimonial, 5000); }
function resetTTimer(){ clearInterval(tTimer); startTTimer(); }
startTTimer();

/* ============ Gallery Lightbox ============ */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-img");
const lightboxClose = $("#lightbox-close");
$$(".g-img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightboxClose.click();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("open")) lightboxClose.click();
});

/* ============ Footer Year + Back to Top ============ */
$("#year").textContent = new Date().getFullYear();
const backToTop = $("#backToTop");
window.addEventListener("scroll", () => {
  backToTop.style.opacity = window.scrollY > 600 ? "1" : "0.35";
});
