import React, { useRef, useEffect } from 'react';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import * as THREE from 'three';


const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {

            const scene = new THREE.Scene(), 
            renderer = new THREE.WebGLRenderer(),
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
            controls = new FirstPersonControls(camera, renderer.domElement);

            const cbgeometry = new THREE.BoxGeometry(), cbmaterial = new THREE.MeshBasicMaterial({ color: 'hotpink', wireframe: true, transparent: true, opacity: 0.4 });
            const cube = new THREE.Mesh(cbgeometry, cbmaterial);
            camera.position.z = 5;

            controls.movementSpeed = 150;
            controls.lookSpeed = 0.1;

            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);

            scene.add(cube);

            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
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
