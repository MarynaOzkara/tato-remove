// YEAR
document.getElementById('yr').textContent = new Date().getFullYear();

// LANG
let currentLang = 'ru';
function switchLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.querySelectorAll('[data-'+lang+']').forEach(el => {
    el.textContent = el.getAttribute('data-'+lang);
  });
  document.querySelectorAll('[data-'+lang+'-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-'+lang+'-placeholder');
  });
  document.documentElement.lang = lang;
}

// HERO SLIDER
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.sdot');
let cur = 0, autoplay, isDragging = false, startX = 0;
function showSlide(n) {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('active');
}
document.getElementById('snext').onclick = () => { showSlide(cur+1); resetAuto(); };
document.getElementById('sprev').onclick = () => { showSlide(cur-1); resetAuto(); };
dots.forEach((d,i) => d.onclick = () => { showSlide(i); resetAuto(); });
function resetAuto() { clearInterval(autoplay); autoplay = setInterval(() => showSlide(cur+1), 3000); }
resetAuto();
const hs = document.getElementById('heroSlider');
hs.addEventListener('mouseenter', () => clearInterval(autoplay));
hs.addEventListener('mouseleave', resetAuto);
hs.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
hs.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; if(Math.abs(dx)>40){ showSlide(dx<0?cur+1:cur-1); resetAuto(); } });

// BURGER
const burgerBtn = document.getElementById('burgerBtn');
const mnavPanel = document.getElementById('mnavPanel');
const mnavOverlay = document.getElementById('mnavOverlay');
const mnavClose = document.getElementById('mnavClose');
function openNav() { mnavPanel.classList.add('open'); mnavOverlay.classList.add('open'); }
function closeNav() { mnavPanel.classList.remove('open'); mnavOverlay.classList.remove('open'); }
burgerBtn.onclick = openNav;
mnavClose.onclick = closeNav;
mnavOverlay.onclick = closeNav;
document.querySelectorAll('.mnav-link').forEach(l => l.addEventListener('click', closeNav));

// HEADER HIDE/SHOW
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const hdr = document.getElementById('hdr');
  if(s > 160 && s - lastScroll > 4) hdr.classList.add('hide');
  else if(lastScroll - s > 4) hdr.classList.remove('hide');
  lastScroll = s;
}, {passive:true});

// CHAT
document.getElementById('chatToggle').onclick = () => {
  document.getElementById('chatPanel').classList.toggle('open');
};

// INTERSECTIONOBSERVER
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el => observer.observe(el));

// DRAG SLIDERS
document.querySelectorAll('.slider-wrap,.adv-grid').forEach(slider => {
  let isDown = false, startX2, scrollLeft;
  slider.addEventListener('mousedown', e => { isDown=true; slider.style.cursor='grabbing'; startX2=e.pageX-slider.offsetLeft; scrollLeft=slider.scrollLeft; });
  slider.addEventListener('mouseleave', () => { isDown=false; slider.style.cursor='grab'; });
  slider.addEventListener('mouseup', () => { isDown=false; slider.style.cursor='grab'; });
  slider.addEventListener('mousemove', e => { if(!isDown) return; e.preventDefault(); const x=e.pageX-slider.offsetLeft; slider.scrollLeft = scrollLeft-(x-startX2)*1.5; });
});

// EQUIPMENT PARALLAX
const equipSection = document.getElementById('equipment');
const equipArch = document.getElementById('equipArch');
const equipCard = document.getElementById('equipCard');
const equipText = document.getElementById('equipText');
let ticking = false;

function updateEquip() {
  if(window.innerWidth <= 768) return;
  const rect = equipSection.getBoundingClientRect();
  const total = equipSection.offsetHeight - window.innerHeight;
  if(total <= 0) return;

  // progress 0→1 across the full sticky scroll distance
  const progress = Math.max(0, Math.min(1, -rect.top / total));

  // Arch: width = 75vw.
  // At progress=0 → right edge of arch is at 0px (fully off-screen left): translateX = -100%
  // At progress=1 → right edge of arch reaches ~75% of viewport = center of circle: translateX = 0%
  // But we want to END movement at 0%, meaning fully in position.
  // To make arch arrive at center-of-circle we keep translateX: -100% → 0%
  if(equipArch) equipArch.style.transform = `translateX(${-100 + progress * 100}%)`;

  // Card floats up slightly as arch arrives
  if(equipCard) {
    equipCard.style.transform = `translateY(${60 - progress * 60}px)`;
    equipCard.style.opacity = String(Math.min(1, progress * 2));
  }

  if(equipText) equipText.style.transform = `translateY(${(1 - progress) * 20}px)`;
  ticking = false;
}

// Init card invisible
if(equipCard) { equipCard.style.opacity = '0'; equipCard.style.transition = 'none'; }

window.addEventListener('scroll', () => { if(!ticking) { requestAnimationFrame(updateEquip); ticking = true; } }, {passive:true});
updateEquip();

// FORMS
function submitQuickForm(btn) {
  const form = btn.closest('.hc-form');
  form.innerHTML = '<p style="padding:20px;color:var(--navy);font-size:16px" data-ru="Спасибо! Свяжемся с вами скоро." data-en="Thank you! We\'ll contact you soon.">Спасибо! Свяжемся с вами скоро.</p>';
}
function submitBooking() {
  const name = document.getElementById('bkName').value.trim();
  const phone = document.getElementById('bkPhone').value.trim();
  if(!name || !phone) { alert(currentLang==='ru'?'Пожалуйста, заполните имя и телефон.':'Please fill in your name and phone.'); return; }
  document.querySelector('.book-form').style.display='none';
  document.getElementById('bookThankyou').classList.add('show');
}
