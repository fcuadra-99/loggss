import React, { useRef, useEffect } from 'react';
import { sens } from './PauseMenu';
import * as THREE from 'three';
import PauseMenu from './PauseMenu';

let ctrlon = true;

let controls: { [key: number]: boolean } = {};
let player = {
    height: .1,
    turnSpeed: .001,
    speed: .1,
    jumpHeight: 0.23,
    gravity: .01,
    velocity: 0,
    horsens: 0.2,
    radius: 1,
    jumps: false,
    sens: 0.002
};

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

            // Ctrl
            const m = { x: 0, y: 0 };
            function ctrl() {
                let { bnds, dir, mv, spd } = {
                    bnds: { minX: -50, maxX: 50, minY: -3, maxY: 10, minZ: -50, maxZ: 50 },
                    dir: new THREE.Vector3(),
                    mv: new THREE.Vector3(),
                    spd: player.speed * 1,
                }
                cam.getWorldDirection(dir).normalize();

                if (!ctrlon) {
                    const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
                    if (controls[87]) mv.add(dir);
                    if (controls[83]) mv.sub(dir);
                    if (controls[65]) mv.sub(side);
                    if (controls[68]) mv.add(side);

                    if (mv.length() > 0) {
                        const pos = cam.position.clone().add(mv.normalize().multiplyScalar(spd));
                        const height = player.height / 2;
                        cam.position.set(
                            THREE.MathUtils.clamp(pos.x, bnds.minX + player.radius, bnds.maxX - player.radius),
                            THREE.MathUtils.clamp(pos.y, bnds.minY + height, bnds.maxY - height),
                            THREE.MathUtils.clamp(pos.z, bnds.minZ + player.radius, bnds.maxZ - player.radius)
                        );
                    }

                    if (10 < Math.abs(m.x) || 5 < Math.abs(m.y)) {
                        cam.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), - m.x * player.sens);
                        cam.rotateX(- m.y * player.sens);
                    }

                    const euler = new THREE.Euler().setFromQuaternion(cam.quaternion, 'YXZ');
                    euler.x = THREE.MathUtils.clamp(euler.x, -0.8, 1);
                    cam.quaternion.setFromEuler(euler);

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
                            opacity: 0
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
                    let moveTimeout;
                    if (!ctrlon) {
                        m.x = e.movementX;
                        m.y = e.movementY;
                        clearTimeout(moveTimeout);
                        moveTimeout = setTimeout(() => {
                            m.x *= 0.9;
                            m.y *= 0.9;
                        }, 100);
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
                jAnim();
                ctrl();
                player.sens = sens();
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

    return (
        <>
            <div ref={containerRef} />
            {PauseMenu(ctrlon)}
        </>
    );
};

export default ThreeScene;