gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    const leftCards = [gsap.utils.toArray(".benefits-card")[0], gsap.utils.toArray(".benefits-card")[1]];
    const rightCards = [gsap.utils.toArray(".benefits-card")[2], gsap.utils.toArray(".benefits-card")[3]];
    const triggerSection = document.querySelector("#trigger");

    gsapTo(leftCards, rightCards, triggerSection);

});
document.addEventListener("DOMContentLoaded", () => {

    const leftCards = [gsap.utils.toArray(".step-card")[0], gsap.utils.toArray(".step-card")[2]];
    const rightCards = [gsap.utils.toArray(".step-card")[1], gsap.utils.toArray(".step-card")[3]];
    const triggerSection = document.querySelector(".step-card").closest(".section-style");

    gsapTo(leftCards, rightCards, triggerSection);
})
document.addEventListener("DOMContentLoaded", () => {

    const leftCards = [gsap.utils.toArray(".who-card")[0]];
    const middleCards = [gsap.utils.toArray(".who-card")[1]]
    const rightCards = [gsap.utils.toArray(".who-card")[2]];
    const triggerSection = document.querySelector(".who-card").closest(".section-style");

    gsapTo(leftCards, rightCards, triggerSection);
    gsap.set(middleCards, { opacity: 0, y: 250 });
    gsap.to(middleCards, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: triggerSection,
            start: "top 50%",
            toggleActions: "play none none reverse"
        }
    });
})

function gsapTo(leftCards, rightCards, triggerSection) {
    gsap.set(leftCards, { opacity: 0, x: -150 });
    gsap.set(rightCards, { opacity: 0, x: 150 });

    gsap.to(leftCards, {
        duration: 0.8,
        opacity: 1,
        x: 0,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: triggerSection,
            start: "top 50%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.to(rightCards, {
        duration: 0.8,
        opacity: 1,
        x: 0,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
            trigger: triggerSection,
            start: "top 50%",
            toggleActions: "play none none reverse"
        }
    });

    ScrollTrigger.refresh();

}