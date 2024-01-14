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
    this.canvas.nativeElement.onmousedown = (e) => e.button !== 1;

    console.log(this.canvas);
    // play with antialias to check performance
    this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas: this.canvas.nativeElement, powerPreference: "high-performance" } );
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

    const points = [];
    points.push( new THREE.Vector3( -0.5, 0.5) );
    points.push( new THREE.Vector3( 0, 0) );
    points.push( new THREE.Vector3( 0.5, 0.5) );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 0.5 } );
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.resizeRendererToDisplaySize();

    controls.addEventListener('change', () => this.render());
    window.addEventListener( 'resize', () => this.resizeRendererToDisplaySize());
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
