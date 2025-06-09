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
    const [interr, setinter] = useState(false);
    let mode = getCookie('mode')
    let theme = {
        mcol: 'rgba(0, 0, 0, 0.575)',
        scol: 'rgb(24, 24, 24)',
        tcol: 'rgb(255, 255, 255)'
    }
    if (mode == 'light') {
        theme = {
            mcol: 'rgba(255, 255, 255, 0.74)',
            scol: 'rgb(243, 243, 243)',
            tcol: 'rgb(0, 0, 0)'
        }
    } else if (mode == 'dark') {
        theme = {
            mcol: 'rgba(0, 0, 0, 0.575)',
            scol: 'rgb(24, 24, 24)',
            tcol: 'rgb(255, 255, 255)'
        }
    }
    front; interr;
    inter = interr;

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

                if (!ctrlon && !inter) {
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


                if (intersects.length === 0 && !ctrlon) {
                    setfront('');
                    setfacer('');
                    document.onclick = null;
                } else if (!ctrlon) {
                    for (let i = 0; i < intersects.length && !ctrlon; i++) {
                        const obj = intersects[i].object;
                        setfront(obj.name);
                        setfacer(obj.name);
                        document.onclick = function () {
                            if (obj.name != '' && obj.name != 'Text') {
                                setinter(interr => !interr)
                            }
                        }
                    }
                } else {
                    document.onclick = null;
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
            {interact(front)}
        </>
    );

    function interact(f: string) {
        f;
        const styles = {
            fa: {
                position: 'fixed',
                backgroundColor: `${theme.mcol}`,
                top: '0',
                opacity: `${toggle(interr)}`,
                width: '100%',
                height: '100vh',
                textAlign: 'center',
                verticalAlign: 'middle'
            } as React.CSSProperties,
            p: {
                margin: '40px 100px',
                color: `${theme.tcol}`
            } as React.CSSProperties,
            h2: {
                margin: '70px 100px',
                color: `${theme.tcol}`
            } as React.CSSProperties,
            img: {
                maxWidth: '80%',
                maxHeight: '50%',
                margin: '0px 50px'
            } as React.CSSProperties
        }

        function Text() {
            switch (facing) {
                case "semcube1":
                    return `#1 Navigating Software Development in the Industry | Speaker: Ned Isaiah Palacios | 
Attending the seminar on navigating the software development industry taught me that it's not all about coding, but it's also about building connections. Early in my journey, I was hesitant to reach out or ask for help, afraid it would make me seem inexperienced. Looking back, I regret not networking sooner, as some of my best opportunities came from simple conversations.
The speaker emphasized that companies often prefer to hire people they know or have seen before, which made me realize how important it is to be visible and confident. I learned that connecting with others can be just as valuable as technical skills, and I now understand the power of being open, approachable, and proactive.
Another important takeaway was the value of slowly building a portfolio. The speaker encouraged us to use it as a way to show our growth, skills, and experiences to potential employers. This seminar boosted my confidence and gave me a clearer direction on how to navigate my career by balancing both my technical development and personal connections.|/sem1.jpg`
                case "semcube2":
                    return `#2 Enhancing Audio Data Processing: Development and Evaluation of a Transcriber Tool|
                    Speaker: Sir Carlo Castro|
Our speaker presented his capstone project titled "SultiWag," a unique application that focuses on converting indigenous languages into English. His project aimed to bridge communication gaps through technology, especially in preserving and understanding native dialects.
In addition to the translation feature, Sir Carlo showcased how the app transcribes audio input. This functionality allows spoken words in indigenous languages to be recognized and then converted into English text. It demonstrated the app’s potential for educational and cultural preservation purposes.
The speaker also shared valuable insights on what we should expect in our own capstone journeys. He emphasized the importance of originality, real-world application, and proper time management. His talk gave us a clearer picture of the challenges and rewards that come with developing a meaningful project.|/sem2.jfif`
                case "semcube3":
                    return `#3 Research 101: Conference Presentation and Funding Techniques|
                    Speaker: Sir Cris John David R. Manero|
The speaker for our third seminar session focused on teaching us effective tips and techniques for presenting our research confidently and clearly. The session was designed to help us become more comfortable and well-prepared for future academic presentations. It provided us with a better understanding of how to communicate our ideas effectively.
The speaker emphasized the importance of thoroughly knowing our topic and practicing consistently. Key techniques such as using visual aids wisely and maintaining eye contact were discussed. These strategies were shown to enhance both delivery and audience engagement.
In addition to the technical advice, the speaker encouraged us to stay calm and composed during presentations. We were reminded that feeling nervous is normal and can be managed through preparation and self-confidence. These insights helped reduce our anxiety and gave us a more positive perspective on presenting our research.|/sem3.jpg`
                case "semcube4":
                    return `#4 TherapEase: Bridging and Fostering Therapy Collaboration for Therapists and Carers|Speaker: Sir Hizon Caja|
The speaker for our fourth seminar session presented a capstone project called TherapEase. The session focused on explaining how the application works and the specific problems it aims to solve for people in need. The presentation provided insight into how technology can be used for meaningful, real-world impact.
The speaker explained the application's features and how it was designed to support individuals requiring therapeutic assistance. The discussion included technical details and real-life scenarios where the app could be beneficial. It helped us understand the process of developing a purposeful and user-focused project.
The speaker also offered advice on what to expect in our own capstone journey. Emphasis was placed on proper planning, identifying real-world problems, and staying committed to our ideas. The guidance helped set clearer expectations and encouraged us to think critically about our future work.|/sem4.jpg`
                case "semcube5":
                    return `#5 Research 101: The Ins and Outs of Software Engineering Research Project.|Speaker: Ma'am Shenna Rhea Cloribel|
The speaker for our fifth seminar session shared tips and techniques for approaching future software engineering projects. The session aimed to prepare us for the challenges and expectations we may face during the development process. Her insights were practical and aligned with real industry experiences.
To support the discussion, the speaker presented a past, working application developed by UIC CCS alumni. This example showcased how a well-designed system can remain relevant and functional even years after its creation. It served as a strong reminder of the importance of quality, planning, and adaptability in software design.
The speaker encouraged us to take inspiration from existing projects while also focusing on innovation. We were reminded to be open to learning and to constantly refine our ideas throughout development. This motivated us to aim for lasting impact in our future software engineering efforts.|/sem5.jpg`
                case "semcube6":
                    return `#6 Bridging Academia and Startup Innovation|
                Speaker: Caesar Ian Benablo|
Listening to this talk made me realize how often student research ends up being underutilized. Most of us focus so much on just finishing our thesis or graduating that we forget the bigger picture: what happens to our work afterward? Our speaker pointed out that research shouldn’t just be for academic requirements; it should lead to real solutions that can benefit communities or even lead to startup opportunities.
He explained that for research to have real value, it needs to go through steps like prototyping, customer validation, and actual use in the real world. Unfortunately, many research outputs never make it that far. To change that, students need to develop an entrepreneurial mindset, teachers need more support, and schools should connect more with communities. He also emphasized the importance of having incubators, accessible funding, and public spaces where innovators can collaborate and build.
What stuck with me most is the idea that graduation isn’t the finish line — it’s just the start. We need to think about how our work can continue to grow and make an impact. This talk made me reflect on my own goals and how I can push my ideas beyond the classroom to actually help people and create something meaningful.|sem6.jpg`
                case "abtcube":
                    return `Hi I'm Francis!|My name is Francis Neil V. Cuadra, and I’m a 20-year-old college student at the University of the Immaculate Conception. I love programming, drawing, playing video games, and listening to music in my free time. Balancing my studies with my hobbies keeps me motivated and lets me explore both creativity and technology.||/pfp.jpg`
                case "certcube1":
                    return `Build a Free Website with WordPress|||/cert1.png`
                case "tourcube1":
                    return `#1 The Mindanao Media Hub Tour||On May 30th, 2025, we visited the Mindanao Media Hub located in Talomo, Davao City for a tour session inside the facility. The visit provided us with a deeper understanding of how broadcasting operations are carried out in a professional setting. It was an eye-opening experience that gave us a behind-the-scenes look at the world of media production.
During the tour, we learned about the various equipment used in broadcasting and how each component plays a crucial role in maintaining a smooth operation. We were introduced to the importance of keeping the machines and systems in excellent condition at all times. The staff also explained the workflow and coordination involved in delivering news and other media content efficiently.
This visit was truly a surreal experience, especially since it was the first time many of us had been inside a real news broadcasting set. Seeing the production environment firsthand made us appreciate the complexity and dedication required in the field. It was an inspiring and memorable part of our learning journey.|/tour1.jpg`
                case "workcube1":
                    return `#1 Prompt Engineering for Online and Offline LLMs|Speaker: Eric John Emberda|
Prompt engineering is becoming a really useful skill, especially with how much we use AI these days. The speaker showed us that not all AI models work the same way, so the way we ask questions or give instructions really matters. We learned about different prompting styles like few-shot and chain of thought, which help us get better responses depending on what we need.

As college students, prompt engineering can help us with things like writing papers, studying for exams, or even organizing ideas. Instead of spending hours looking for the right info, we can use AI to help us work faster and more efficiently—if we know how to prompt it the right way. It’s kind of like learning how to ask better questions so we can get better answers.

At the same time, we have to remember that AI is just a tool, not something we should rely on for everything. The speaker made it clear that we still need to think for ourselves and not let AI do all the work. If we use it smartly, AI can make our lives easier, but we still need to put in the effort and use our judgment.|/work1.jpg`
                default:
                    return `Empty||`
            }
        }

        console.log(Text().split('|')[3])


        return (
            <>
                <div className={`inactive`} style={styles.fa}>
                    <h2 style={styles.h2}>
                        <b>{`${Text().split('|')[0]}`}</b>
                    </h2>
                    <img src={Text().split('|')[3]} style={styles.img} alt="" />
                    <p style={styles.p}>
                        <b>{`${Text().split('|')[1]}`}</b>
                    </p>
                    <p style={styles.p}>
                        {`${Text().split('|')[2]}`}
                    </p>
                </div>
            </>
        )
    }
};

let facing = '', inter = false;

function setfacer(f: any) {
    facing = f;
}

const toggle = (toggle: boolean) => toggle ? "1" : "0";

// function setCookie(cname: string, cvalue: any, exdays: number) {
//     const d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     let expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }
function getCookie(cname: string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// function isSet(cname: string) {
//     let user = getCookie(cname);
//     if (user != "") {
//         return true;
//     } else {
//         if (user != "" && user != null) {
//             setCookie("username", user, 365);
//             return false;
//         }
//     }
// }

export default ThreeScene;