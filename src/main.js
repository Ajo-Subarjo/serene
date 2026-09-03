const parallax = document.querySelector('.parallax');
const grass_1 = document.querySelector('#grass1');
const grass_2 = document.querySelector('#grass2');
const cloud = document.querySelector('#cloud');
const ornament = document.querySelector('#ornament')



const sGrass1 = 40;
const sGrass2 = 120;
const sOrnament = 70;

const sGrass1Y = 0.3;
const sGrass2Y = 0.6;
const sOrnamentY = 1.2;


let mouseY = 0;
let mouseX = 0;
let scrollY = 0


window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;

  update_parallax()
});

window.addEventListener("scroll", () => {
  scrollY = window.scrollY

  update_parallax()
});


function update_parallax() {

  grass_1.style.transform = `
    translate(
      ${mouseX / sGrass1}px,
      ${mouseY/ sGrass1 + scrollY * sGrass1Y}px
    )`;

  grass_2.style.transform = `
    translate(
      ${mouseX / sGrass2}px,
      ${mouseY / sGrass2 + scrollY * sGrass2Y}px
    )`;

  ornament.style.transform = `
    translate(
      ${mouseX / sOrnament}px,
      ${mouseY / sOrnament + scrollY * sOrnamentY}px
    )`;
}
