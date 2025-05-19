import React, { useRef, useEffect } from 'react';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 5;

            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 'hotpink', wireframe: true, transparent: true, opacity: 0.4 } );
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            scene.fog = new THREE.Fog('aqua', 4, 6.5);
            const flyControls = new FlyControls( camera, renderer.domElement );
            flyControls.update(1);
            flyControls.movementSpeed = 0.3;

            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                flyControls.update(1);
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };

            const handleResize = () => {
                const width = window.innerWidth;
                const height = window.innerHeight;

                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            renderScene();

            return () => {
                window.removeEventListener('resize', handleResize);
                containerRef.current?.removeChild(renderer.domElement);
                renderer.dispose();
            };
        }
    }, []);

    return <div ref={containerRef} />;
};
export default ThreeScene;
