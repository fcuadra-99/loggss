import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

let ctrlon = true;

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
                radius: 1,
                jumps: false
            };


            // Ctrl
            const m = { x: 0, y: 0 };
            function ctrl() {
                const bnds = { minX: -50, maxX: 50, minY: -3, maxY: 7, minZ: -50, maxZ: 50 };
                const movement = new THREE.Vector3();
                const dir = new THREE.Vector3();
                cam.getWorldDirection(dir).normalize();

                if (movement.length() > 0) {
                    const newPosition = cam.position.clone().add(movement);

                    newPosition.x = THREE.MathUtils.clamp(newPosition.x, bnds.minX, bnds.maxX);
                    newPosition.y = THREE.MathUtils.clamp(newPosition.y, bnds.minY, bnds.maxY);
                    newPosition.z = THREE.MathUtils.clamp(newPosition.z, bnds.minZ, bnds.maxZ);

                    cam.position.copy(newPosition);
                }

                if (!ctrlon) {
                    const moveVector = new THREE.Vector3();
                    const speed = player.speed * 1;
                    const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();

                    if (controls[87]) moveVector.add(dir);
                    if (controls[83]) moveVector.sub(dir);
                    if (controls[65]) moveVector.sub(side);
                    if (controls[68]) moveVector.add(side);

                    if (moveVector.length() > 0) {
                        const pos = cam.position.clone().add(moveVector.normalize().multiplyScalar(speed));
                        const height = player.height / 2;
                        cam.position.set(
                            THREE.MathUtils.clamp(pos.x, bnds.minX + player.radius, bnds.maxX - player.radius),
                            THREE.MathUtils.clamp(pos.y, bnds.minY + height, bnds.maxY - height),
                            THREE.MathUtils.clamp(pos.z, bnds.minZ + player.radius, bnds.maxZ - player.radius)
                        );
                    }

                    if (10 < m.x) {
                        cam.rotation.y += m.x * 0.0022;
                    }
                    if (-10 > m.x) {
                        cam.rotation.y += m.x * 0.0022;
                    }

                    //Up controls still buggy
                    if (10 < m.y) {
                        cam.rotation.x = m.y * 0.0022;
                    }
                    if (-10 > m.y) {
                        cam.rotation.x = m.y * 0.0022;
                    }

                    if (controls[32]) {
                        if (player.jumps) return false;
                        player.jumps = true;
                        player.velocity = -player.jumpHeight;
                    }

                    cam.up.copy(new THREE.Vector3(0, 1, 0));
                    cam.lookAt(cam.position.clone().add(cam.getWorldDirection(new THREE.Vector3())));

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
                        geo: new THREE.BoxGeometry(100, 10, 100),
                        mat: new THREE.MeshBasicMaterial({
                            color: 'skyblue',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.25
                        }),
                        pos: new THREE.Vector3(0, 2, 0)
                    },
                    {
                        name: 'plyr',
                        geo: new THREE.BoxGeometry(0.3, 0.5, 0.3),
                        mat: new THREE.MeshBasicMaterial({
                            color: 'skyblue',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.1
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
            {
                document.addEventListener("pointerlockchange", () => {
                    if (document.pointerLockElement === document.body) {
                        ctrlon = false;
                    } else {
                        ctrlon = true;
                    }
                });

                document.addEventListener('keydown', ({ keyCode }) => {
                    controls[keyCode] = true;
                });
                document.addEventListener('keyup', ({ keyCode }) => {
                    controls[keyCode] = false;
                });

                document.onmousemove = (e) => {
                    if (!ctrlon) {
                        m.x = e.movementX;
                        m.y = e.movementY;
                    }
                }


            }

            function jAnim() {
                player.velocity += player.gravity;
                cam.position.y -= player.velocity;

                if (cam.position.y < player.height) {
                    cam.position.y = player.height;
                    player.jumps = false;
                }
            }

            function init() {
                scen.fog = new THREE.Fog('white', 1, 50);
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
                jAnim();
                mesh.plyr.position.copy(cam.position);
                mesh.plyr.rotation.copy(cam.rotation);
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