import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit{
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  scene: THREE.Scene;
	renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    this.scene.add( light );
  }
  
  ngAfterViewInit(): void {
    console.log(this.canvas);
    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: this.canvas.nativeElement } );
    console.log(this.renderer);

    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 2;
    
    const controls = new OrbitControls(this.camera, this.canvas.nativeElement);
    controls.target.set(0, 0, 0);
    controls.update();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    this.makeInstance(geometry, 0x44aa88,  0);
    this.makeInstance(geometry, 0x8844aa, -2);
    this.makeInstance(geometry, 0xaa8844,  2);

    this.render();

    controls.addEventListener('change', () => this.render());
  }

  makeInstance(geometry: THREE.BoxGeometry, color: THREE.ColorRepresentation, x: number) {
		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		this.scene.add( cube );

		cube.position.x = x;

		return cube;
	}

	render() {
		if ( this.resizeRendererToDisplaySize() ) {
			const canvas = this.renderer.domElement;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
		}
		this.renderer.render(this.scene, this.camera );
	}

  resizeRendererToDisplaySize() {
		const canvas = this.renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			this.renderer.setSize( width, height, false );

		}

		return needResize;

	}
}
