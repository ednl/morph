const margin = 20;

let n1 = 3;
let n2 = 6;
let morphAngle = 0;
let rotAngle = 0;

let p1, p2, dim, half, scaling, pixsize, fgCol, bgCol;
let slide1, slide2;

function windowResized() {
	dim = min(windowWidth, windowHeight);
	half = floor(dim / 2);
	scaling = half - margin;
	pixsize = 1 / dim;
	resizeCanvas(dim, dim);

	if (slide1) {
		slide1.position(margin/2, 0);
		slide2.position(half + margin/2, 0);
		slide1.style('width', `${scaling}px`);
		slide2.style('width', `${scaling}px`);
	}
}

function makeInterpol(n1, n2) {
	const p = [];
	let da = TWO_PI / n1;
	let a1 = 0;
	let a2 = da;
	let v1, v2 = createVector(cos(a1), sin(a1));
	for (let i = 0; i < n1; ++i) {
		v1 = v2;
		v2 = createVector(cos(a2), sin(a2));
		for (let j = 0; j < n2; ++j) {
			p.push(p5.Vector.lerp(v1, v2, j / n2));
		}
		a1 = a2;
		a2 += da;
	}
	return p;
}

function changeSlide() {
	n1 = min(slide1.value(), slide2.value());
	n2 = max(slide1.value(), slide2.value());
	if (n2 >= 13)
		n2 = 360;

	p1 = makeInterpol(n1, n2);
	p2 = makeInterpol(n2, n1);
}

function setup() {
	createCanvas();
	slide1 = createSlider(2, 12, n1, 1);
	slide2 = createSlider(3, 13, n2, 1);
	changeSlide();
	windowResized();

	fgCol = color(0);
	bgCol = color(255, 204, 153);

	stroke(fgCol);
	strokeWeight(2 * pixsize);

	slide1.changed(changeSlide);
	slide2.changed(changeSlide);
}

function draw() {
	background(bgCol);
	translate(half, half);
	scale(scaling, -scaling);
	rotate(rotAngle);

	const hcosma = 0.5 * cos(morphAngle);
	const f1 = 0.5 + hcosma;
	const f2 = 0.5 - hcosma;
	fill(255 * f1, 51 * f2, 255 * f2);
	// const morph = 1 - 0.5 * n1 * f2;  // max overshoot without arcs intersecting
	const morph = f1;
	beginShape();
	for (let i = 0; i < p1.length; ++i) {
		const v = p5.Vector.lerp(p1[i], p2[i], morph);
		vertex(v.x, v.y);
	}
	endShape(CLOSE);

	morphAngle += 0.015;
	rotAngle += 0.005;
}
