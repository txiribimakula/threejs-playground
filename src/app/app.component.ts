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
  camera!: THREE.OrthographicCamera;

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

    this.camera = new THREE.OrthographicCamera();
    this.camera.position.z = 2;
    
    const controls = new OrbitControls(this.camera, this.canvas.nativeElement);
    controls.mouseButtons = {
      LEFT: undefined,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: undefined
    }
    controls.zoomToCursor = true;
    controls.target.set(0, 0, 0);
    controls.update();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    this.makeInstance(geometry, 0x44aa88,  0);
    this.makeInstance(geometry, 0x8844aa, -2);
    this.makeInstance(geometry, 0xaa8844,  2);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resizeRendererToDisplaySize();

    controls.addEventListener('change', () => this.render());
    window.addEventListener( 'resize', () => this.resizeRendererToDisplaySize());
  }

  makeInstance(geometry: THREE.BoxGeometry, color: THREE.ColorRepresentation, x: number) {
		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		this.scene.add( cube );

		cube.position.x = x;

		return cube;
	}

	render() {
		this.renderer.render(this.scene, this.camera );
	}

  resizeRendererToDisplaySize() {
		const canvas = this.renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const isResizeNeeded = canvas.width !== width || canvas.height !== height;
		if (isResizeNeeded) {
			this.renderer.setSize( width, height, false );
			this.camera.updateProjectionMatrix();
      this.render();
		}
	}
}
