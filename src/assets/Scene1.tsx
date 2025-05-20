import React, { useRef, useEffect } from 'react';
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
                rend: new THREE.WebGLRenderer(),
            };


            // Plyr
            let controls: { [key: number]: boolean } = {};
            let player = {
                height: .1,
                turnSpeed: .001,
                speed: .1,
                jumpHeight: .2,
                gravity: .01,
                velocity: 0,
                horsens: 0.2,
                jumps: false
            };


            // Ctrl
            const m = { x: 0, y: 0 };
            let ctrlon = true;
            const originalUp = new THREE.Vector3(0, 1, 0);

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
                const yaw = new THREE.Vector3(1, 0, 0);
                const pitch = new THREE.Vector3(0, 1, 0);
                cam.getWorldDirection(dir).normalize();
                dir.y = 0;


                if (controls[87]) {
                    if (controls[16]) {
                        cam.position.addScaledVector(dir, player.speed * 2);
                    } else {
                        cam.position.addScaledVector(dir, player.speed);
                    }
                }
                if (controls[83]) cam.position.addScaledVector(dir, -player.speed);
                const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
                if (controls[65]) cam.position.addScaledVector(side, -player.speed);
                if (controls[68]) cam.position.addScaledVector(side, player.speed);
                if (0.6 < m.y / window.innerWidth && ctrlon) {
                    if (cam.rotation.x < -0.5) return;
                    const mult = m.y / (window.innerHeight * 0.4);
                    cam.rotateOnAxis(yaw, -0.002 * (1.5 * Math.exp(mult)));
                    cam.up.copy(originalUp);
                }
                if (0.4 > m.y / window.innerWidth && ctrlon) {
                    if (cam.rotation.x > 0.8) return;
                    const mult = (window.innerHeight - m.y) / (window.innerHeight * 0.4);
                    cam.rotateOnAxis(yaw, 0.002 * (1.5 * Math.exp(mult)));
                    cam.up.copy(originalUp);
                }
                if (0.7 < m.x / window.innerWidth && ctrlon) {
                    const mult = m.x / (window.innerWidth * 0.3);
                    cam.rotateOnAxis(pitch, -0.001 * (1.5 * Math.exp(mult)));
                    cam.up.copy(originalUp);
                    cam.lookAt(cam.position.clone().add(cam.getWorldDirection(new THREE.Vector3())));
                }
                if (0.3 > m.x / window.innerWidth && ctrlon) {
                    const mult = (window.innerWidth - m.x) / (window.innerWidth * 0.3);
                    cam.rotateOnAxis(pitch, 0.001 * (1.5 * Math.exp(mult)));
                    cam.up.copy(originalUp);
                    cam.lookAt(cam.position.clone().add(cam.getWorldDirection(new THREE.Vector3())));
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
                    },
                    {
                        name: 'plyr',
                        geo: new THREE.BoxGeometry(0.1, 0.1, 0.1),
                        mat: new THREE.MeshBasicMaterial({
                            color: 'skyblue',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.2
                        }),
                        pos: new THREE.Vector3(0, -0.2, 0)
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
                scen.fog = new THREE.Fog(0xcccccc, 1, 15);
                cam.position.z = 5;
                cam.rotation.z = 0;
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
                mesh.plyr.position.copy(cam.position);
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
