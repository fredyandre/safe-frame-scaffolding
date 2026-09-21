const header=document.querySelector('.site-header');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
const updateHeader=()=>header.classList.toggle('scrolled',window.scrollY>24);
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'Open navigation':'Close navigation');nav.classList.toggle('open',!open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.13,rootMargin:'0px 0px -30px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelector('#year').textContent=new Date().getFullYear();

const heroSlides=[...document.querySelectorAll('.hero-slide')];
if(heroSlides.length){
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const requestedHero=Number(new URLSearchParams(window.location.search).get('hero'));
  const previewHero=Number.isInteger(requestedHero)&&requestedHero>=1&&requestedHero<=heroSlides.length?requestedHero-1:null;
  if(reducedMotion||previewHero!==null){
    heroSlides[previewHero??0].classList.add('is-active');
  }else{
    let activeHeroSlide=0;
    requestAnimationFrame(()=>requestAnimationFrame(()=>heroSlides[0].classList.add('is-active')));
    window.setInterval(()=>{
      const previousSlide=heroSlides[activeHeroSlide];
      activeHeroSlide=(activeHeroSlide+1)%heroSlides.length;
      const nextSlide=heroSlides[activeHeroSlide];
      nextSlide.classList.add('is-active');
      previousSlide.classList.remove('is-active');
    },4000);
  }
}

const galleryItems=[...document.querySelectorAll('.gallery-item')];
const lightbox=document.querySelector('.lightbox');
if(lightbox&&galleryItems.length){
  const lightboxImage=lightbox.querySelector('img');
  const lightboxCaption=lightbox.querySelector('figcaption');
  let activeImage=0;
  const showImage=index=>{
    activeImage=(index+galleryItems.length)%galleryItems.length;
    const item=galleryItems[activeImage];
    lightboxImage.src=item.dataset.src;
    lightboxImage.alt=item.querySelector('img').alt;
    lightboxCaption.textContent=item.dataset.caption;
  };
  galleryItems.forEach((item,index)=>item.addEventListener('click',()=>{showImage(index);lightbox.showModal()}));
  lightbox.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(activeImage-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click',()=>showImage(activeImage+1));
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
  document.addEventListener('keydown',event=>{
    if(!lightbox.open)return;
    if(event.key==='ArrowLeft')showImage(activeImage-1);
    if(event.key==='ArrowRight')showImage(activeImage+1);
  });
}
