import { ReactLenis } from "@studio-freight/react-lenis";

function SmoothScrolling({ children }) {
  // lenis options for configuration
  const lenisOptions = {
    lerp: 0.08,
    duration: 2.5,
    smoothTouch: true, //smooth scroll for touch devices
    smooth: true,
    smoothMobile: true,
    smoothWheel: true,
    smoothKeyBoard: true,
    smoothSection: true,
    smoothLinks: true,
    smoothForm: true,
    smoothImage: true,
    smoothIframe: true,
    smoothVideo: true,
    smoothIframeVideo: true,
    smoothYoutubeVideo: true,
    smoothVimeoVideo: true,
    smoothHtml5Video: true,
    smoothAudio: true,
    smoothHtml5Audio: true,
    smoothVimeoAudio: true,
    smoothYoutubeAudio: true,


    // // smooth scroll callbacks
    // smoothCallbacks: {
    //   onScrollStart: () => {
    //     console.log("Scrolling started");
    //   },
    //   onScrollStop: () => {
    //     console.log("Scrolling stopped");
    //   },
    // },

    
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
export default SmoothScrolling;