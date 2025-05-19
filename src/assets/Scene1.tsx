import React, { useRef, useEffect } from 'react';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import * as THREE from 'three';


const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Wrld
            const { scen, cam, rend } = {
                scen: new THREE.Scene(),
                cam: new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000),
                rend: new THREE.WebGLRenderer()
            };


            // Plyr
            let controls: { [key: number]: boolean } = {};
            let player = {
                height: .1,
                turnSpeed: .02,
                speed: .1,
                jumpHeight: .2,
                gravity: .01,
                velocity: 0,

                jumps: false
            };

            // Ctrl
            const m = { x: 0, y: 0 };
            let ctrlon = false;

            document.addEventListener('mouseenter', () => ctrlon = true);
            document.addEventListener('mouseleave', () => ctrlon = false);
            document.addEventListener('keydown', ({ keyCode }) => {
                controls[keyCode] = true;
            });
            document.addEventListener('keyup', ({ keyCode }) => {
                controls[keyCode] = false;
            });

            document.onmousemove = (e) => {
                m.x = e.clientX;
                m.y = e.clientY;
            }

            function ctrl() {
                const dir = new THREE.Vector3();
                cam.getWorldDirection(dir).normalize();
                dir.y = 0;

                if (controls[87]) cam.position.addScaledVector(dir, player.speed);
                if (controls[83]) cam.position.addScaledVector(dir, -player.speed);
                const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
                if (controls[65]) cam.position.addScaledVector(side, -player.speed);
                if (controls[68]) cam.position.addScaledVector(side, player.speed);
                if (controls[39]) {
                    cam.rotation.y -= player.turnSpeed;
                }
                if (controls[37]) {
                    cam.rotation.y += player.turnSpeed;
                }
                if (0.7 < m.x/window.innerWidth && ctrlon) {
                    cam.rotation.y -= player.turnSpeed;
                }
                if (0.3 > m.x/window.innerWidth && ctrlon) {
                    cam.rotation.y += player.turnSpeed;
                }
                if (controls[32]) {
                    if (player.jumps) return false;
                    player.jumps = true;
                    player.velocity = -player.jumpHeight;
                }
                
            }

            // Objs
            let mesh: { [key: string]: THREE.Mesh } = {};
            {
                const obj = [
                    {
                        name: 'cube',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshBasicMaterial({
                            color: 'hotpink',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.5
                        }),
                        pos: new THREE.Vector3(0, 0, 0)
                    },
                    {
                        name: 'room',
                        geo: new THREE.BoxGeometry(50, 10, 50),
                        mat: new THREE.MeshBasicMaterial({
                            color: 'skyblue',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.2
                        }),
                        pos: new THREE.Vector3(0, 2, 0)
                    }
                ];

                for (let o of obj) {
                    mesh[o.name] = new THREE.Mesh(o.geo, o.mat);
                    mesh[o.name].position.copy(o.pos);
                    scen.add(mesh[o.name]);
                }
            }


            // Other
            function ixup() {
                player.velocity += player.gravity;
                cam.position.y -= player.velocity;

                if (cam.position.y < player.height) {
                    cam.position.y = player.height;
                    player.jumps = false;
                }
            }

            function init() {
                cam.position.z = 5;
                rend.setSize(window.innerWidth, window.innerHeight);
                containerRef.current?.appendChild(rend.domElement);
            }

            const handleResize = () => {
                cam.aspect = window.innerWidth / window.innerHeight;
                cam.updateProjectionMatrix();
                rend.setSize(window.innerWidth, window.innerHeight);
            };

            const renderScene = () => {
                ctrl();
                ixup();
                mesh.cube.rotation.x += 0.01;
                mesh.cube.rotation.y += 0.01;
                rend.render(scen, cam);
                requestAnimationFrame(renderScene);
            };

            window.addEventListener('resize', handleResize);
            init();
            renderScene();

            return () => {
                window.removeEventListener('resize', handleResize);
                containerRef.current?.removeChild(rend.domElement);
                rend.dispose();
            };
        }
    }, []);

    return <div ref={containerRef} />;
};
export default ThreeScene;
