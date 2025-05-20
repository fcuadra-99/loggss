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
                radius: 1,
                jumps: false
            };


            // Ctrl
            const m = { x: 0, y: 0 };
            let ctrlon = false;
            {
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
            }

            function ctrl() {
                const bnds = { minX: -50, maxX: 50, minY: -3, maxY: 7, minZ: -50, maxZ: 50 };

                const playerSize = {
                    height: 1.0
                };

                const movement = new THREE.Vector3();
                const dir = new THREE.Vector3();
                const pitch = new THREE.Vector3(0, 1, 0);
                cam.getWorldDirection(dir).normalize();
                dir.y = 0;

                if (movement.length() > 0) {
                    const newPosition = cam.position.clone().add(movement);

                    newPosition.x = THREE.MathUtils.clamp(newPosition.x, bnds.minX, bnds.maxX);
                    newPosition.y = THREE.MathUtils.clamp(newPosition.y, bnds.minY, bnds.maxY);
                    newPosition.z = THREE.MathUtils.clamp(newPosition.z, bnds.minZ, bnds.maxZ);

                    cam.position.copy(newPosition);
                }

                if (ctrlon) {
                    if (controls[87]) {
                        if (controls[16]) {
                            cam.position.addScaledVector(dir, player.speed * 2);
                        } else {
                            cam.position.addScaledVector(dir, player.speed);
                        }
                    }

                    const moveVector = new THREE.Vector3();
                    const speed = player.speed * 1;

                    if (controls[87]) moveVector.add(dir);
                    if (controls[83]) moveVector.sub(dir);
                    const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
                    if (controls[65]) moveVector.sub(side);
                    if (controls[68]) moveVector.add(side);

                    if (moveVector.length() > 0) {
                        const p = cam.position.clone().add(moveVector.normalize().multiplyScalar(speed));
                        const h = playerSize.height / 2;
                        cam.position.set(
                            THREE.MathUtils.clamp(p.x, bnds.minX + player.radius, bnds.maxX - player.radius),
                            THREE.MathUtils.clamp(p.y, bnds.minY + h, bnds.maxY - h),
                            THREE.MathUtils.clamp(p.z, bnds.minZ + player.radius, bnds.maxZ - player.radius)
                        );
                    }

                    if (0.6 < m.x / window.innerWidth) {
                        const mult = m.x / (window.innerWidth * 0.4);
                        cam.rotateOnAxis(pitch, -0.001 * (3.5 * Math.exp(mult)));
                    }
                    if (0.4 > m.x / window.innerWidth) {
                        const mult = (window.innerWidth - m.x) / (window.innerWidth * 0.4);
                        cam.rotateOnAxis(pitch, 0.001 * (3.5 * Math.exp(mult)));
                    }
                    if (controls[32]) {
                        if (player.jumps) return false;
                        player.jumps = true;
                        player.velocity = -player.jumpHeight;
                    }

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


            // Coll
            function detectCollisions() {
                const raycaster = new THREE.Raycaster();
                const playerDirection = new THREE.Vector3();

                mesh.plyr.getWorldDirection(playerDirection);

                raycaster.set(mesh.plyr.position, playerDirection.normalize());

                const maxDistance = 10;
                const intersects = raycaster.intersectObjects(scen.children, true);

                if (intersects.length > 0) {
                    const closestCollision = intersects[0];

                    if (closestCollision.distance < maxDistance) {
                        console.log('Collision Detected with', closestCollision.object.name);
                        return closestCollision;
                    }
                }

                return null;
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
                scen.fog = new THREE.Fog('0xcccccc', 1, 50);
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
                detectCollisions();
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
