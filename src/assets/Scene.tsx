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

            const cbgeometry = new THREE.BoxGeometry();
            const cbmaterial = new THREE.MeshBasicMaterial({ color: 'hotpink', wireframe: true, transparent: true, opacity: 0.4 });
            const cube = new THREE.Mesh(cbgeometry, cbmaterial);
            scene.add(cube);

            scene.fog = new THREE.Fog('aqua', 2, 6.5);
            const flyControls = new FlyControls(camera, renderer.domElement);
            flyControls.update(1);
            flyControls.movementSpeed = 0.17;
            flyControls.rollSpeed = 0.012;
            flyControls.autoForward = false;

            const cb2geometry = new THREE.BoxGeometry(50, 50, 50);
            const cube2 = new THREE.Mesh(cb2geometry, cbmaterial);
            cube2.position.y = 20;
            scene.add(cube2);

            

            const renderScene = () => {
                camera.rotation.z = 0;
                camera.position.y = 0;
                if (camera.rotation.x < 0) {
                    camera.rotation.x = 0;
                    camera.rotation.z = 0;
                }
                if (camera.rotation.x > 0.8) {
                    camera.rotation.x = 0.8
                    camera.rotation.z = 0;
                }
                camera.rotation.z = 0;
                console.log(`x: ${camera.rotation.x}`)
                console.log(`y: ${camera.rotation.y}`)
                console.log(`z: ${camera.rotation.x}`)

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
