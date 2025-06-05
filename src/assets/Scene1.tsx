import React, { useRef, useEffect, useState } from 'react';
import { sens } from './PauseMenu';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

import * as THREE from 'three';
import PauseMenu from './PauseMenu';
import { degToRad } from 'three/src/math/MathUtils.js';

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
    const [front, setfront] = useState('Test');

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
                rend: new THREE.WebGLRenderer({ antialias: false }),
            };

            const raycaster = new THREE.Raycaster();
            raycaster.far = 2;
            raycaster.near = 0;
            const pointer = new THREE.Vector2();

            const dlight = new THREE.AmbientLight('white', 1);
            dlight.castShadow = false;

            {
                let test;
                let scale = 3;
                const loder = new GLTFLoader();
                loder.load(
                    "/semtext.glb",
                    function (gltf) {
                        test = gltf.scene;
                        test.rotation.y = degToRad(90);
                        test.position.set(-30, 10, 0)
                        test.scale.set(scale, scale, scale);
                        scen.add(test);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    function (error) {
                        console.log(error);
                    }
                );
                loder.load(
                    "/wttext.glb",
                    function (gltf) {
                        test = gltf.scene;
                        test.rotation.y = degToRad(-90);
                        test.position.set(30, 12.5, 0)
                        test.scale.set(scale, scale, scale);
                        scen.add(test);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    function (error) {
                        console.log(error);
                    }
                );
                loder.load(
                    "/weltext.glb",
                    function (gltf) {
                        test = gltf.scene;
                        test.rotation.y = degToRad(0);
                        test.position.set(0, 12.5, -30)
                        test.scale.set(scale * 2, scale * 2, scale * 2);
                        scen.add(test);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    function (error) {
                        console.log(error);
                    }
                );
                loder.load(
                    "/certext.glb",
                    function (gltf) {
                        test = gltf.scene;
                        test.rotation.y = degToRad(180);
                        test.position.set(0, 10, 30)
                        test.scale.set(scale, scale, scale);
                        scen.add(test);
                    },
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }

            scen.add(dlight);

            const rendScen = new RenderPass(scen, cam);
            const bloompass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                2,
                1,
                0.5
            )

            const bloomComp = new EffectComposer(rend);
            bloomComp.setSize(window.innerWidth, window.innerHeight);
            bloomComp.renderToScreen = true;
            bloomComp.addPass(rendScen);
            bloomComp.addPass(bloompass);

            let roomx = 50, roomz = 50;

            // Objs
            let mesh: { [key: string]: THREE.Mesh } = {};
            {
                const obj = [
                    {
                        name: 'maincube',
                        geo: new THREE.BoxGeometry(10, 10, 10),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('hotpink'),
                            emissiveIntensity: 4,
                        }),
                        pos: new THREE.Vector3(0, 40, 0)
                    },
                    {
                        name: 'abtcube',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('white'),
                            emissiveIntensity: 1,
                        }),
                        pos: new THREE.Vector3(0, 0, -25.5)
                    },
                    {
                        name: 'semcube1',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, 15)
                    },
                    {
                        name: 'semcube2',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, 10)
                    },
                    {
                        name: 'semcube3',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, 5)
                    },
                    {
                        name: 'semcube4',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, 0)
                    },
                    {
                        name: 'semcube5',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, -5)
                    },
                    {
                        name: 'semcube6',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, -10)
                    },
                    {
                        name: 'semcube7',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('skyblue'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-25.5, 0, -15)
                    },
                    {
                        name: 'workcube1',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('yellow'),
                            emissiveIntensity: 1.5,
                        }),
                        pos: new THREE.Vector3(25.5, 0, -5)
                    },
                    {
                        name: 'tourcube1',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('yellow'),
                            emissiveIntensity: 1.5,
                        }),
                        pos: new THREE.Vector3(25.5, 0, 5)
                    },
                    {
                        name: 'certcube1',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('lightgreen'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(5, 0, 25.5)
                    },
                    {
                        name: 'certcube2',
                        geo: new THREE.BoxGeometry(),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.8,
                            flatShading: true,
                            emissive: new THREE.Color('lightgreen'),
                            emissiveIntensity: 2,
                        }),
                        pos: new THREE.Vector3(-5, 0, 25.5)
                    },
                    {
                        name: 'room1',
                        geo: new THREE.BoxGeometry(roomx, 300, roomz),
                        mat: new THREE.MeshStandardMaterial({
                            color: 'white',
                            wireframe: true,
                            transparent: true,
                            opacity: 0.2,
                        }),
                        pos: new THREE.Vector3(0, 148, 0)
                    },
                    // {
                    //     name: 'plyr',
                    //     geo: new THREE.BoxGeometry(30, 30, 30),
                    //     mat: new THREE.MeshBasicMaterial({
                    //         color: 'white',
                    //         wireframe: true,
                    //         transparent: true,
                    //         opacity: 1
                    //     }),
                    //     pos: new THREE.Vector3(0, -0.2, 0)
                    // }
                ];



                for (let o of obj) {
                    mesh[o.name] = new THREE.Mesh(o.geo, o.mat);
                    mesh[o.name].position.copy(o.pos);
                    mesh[o.name].name = o.name;
                    scen.add(mesh[o.name]);
                }
            }

            // Ctrl
            const m = { x: 0, y: 0 };
            let mult = 1.2;
            function ctrl() {
                let { bnds, dir, mv, spd } = {
                    bnds: { minX: -roomx / 2, maxX: roomx / 2, minY: -3, maxY: 10, minZ: -roomz / 2, maxZ: roomz / 2 },
                    dir: new THREE.Vector3(),
                    mv: new THREE.Vector3(),
                    spd: player.speed * mult,
                }
                cam.getWorldDirection(dir).normalize();

                if (!ctrlon) {
                    const side = new THREE.Vector3().crossVectors(dir, cam.up).normalize();
                    if (controls[87]) mv.add(dir);
                    if (controls[16]) mult = 2;
                    else mult = 1.2;
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

                    if (3 < Math.abs(m.x) || 3 < Math.abs(m.y)) {
                        cam.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), - m.x * player.sens);
                        cam.rotateX(- m.y * player.sens);
                    }

                    const euler = new THREE.Euler().setFromQuaternion(cam.quaternion, 'YXZ');
                    euler.x = THREE.MathUtils.clamp(euler.x, -0.9, 1);
                    cam.quaternion.setFromEuler(euler);

                    if (controls[32]) {
                        if (player.jumps) return false;
                        player.jumps = true;
                        player.velocity = -player.jumpHeight;
                    }
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
                            m.x *= 0.01;
                            m.y *= 0.01;
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
                scen.fog = new THREE.Fog('black', 50, 80);
                cam.position.z = 0;
                cam.rotation.z = 0;
                rend.setSize(window.innerWidth, window.innerHeight);
                containerRef.current?.appendChild(rend.domElement);
            }

            const handleResize = () => {
                cam.aspect = window.innerWidth / window.innerHeight;
                cam.updateProjectionMatrix();
                rend.setSize(window.innerWidth, window.innerHeight);
            }


            const dirs = new Map();

            const renderScene = () => {
                jAnim();
                ctrl();
                raycaster.setFromCamera(pointer, cam);

                const intersects = raycaster.intersectObjects(scen.children, true);


                if (intersects.length === 0) {
                    setfront('');
                    setfacer('');
                } else {
                    for (let i = 0; i < intersects.length && !ctrlon; i++) {
                        const obj = intersects[i].object;
                        console.log(obj.name);
                        setfront(obj.name);
                        setfacer(obj.name);
                        document.onclick = function () {
                            console.log('clicked', obj.name);
                        }
                    }
                }



                player.sens = sens();
                // mesh.plyr.position.copy(cam.position);
                // mesh.plyr.rotation.copy(cam.rotation);

                for (const k in mesh) {
                    if (!k.includes('cube')) continue;
                    const c = mesh[k];
                    dirs.has(c) || dirs.set(c, { x: Math.random() < 0.5 ? -1 : 1, y: Math.random() < 0.5 ? -1 : 1 });
                    c.rotation.x += 0.02 * dirs.get(c).x;
                    c.rotation.y += 0.02 * dirs.get(c).y;
                }

                bloomComp.render();
                //rend.render(scen, cam);
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
            <div className='testoverlay'>
                {facing}
            </div>
        </>
    );
};

function setfacer(f: any) {
    facing = f;
}
let facing = '';

export default ThreeScene;