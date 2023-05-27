import { FC } from 'react';

// import { FloatingImages } from './FloatingImages';

export const VideoSection: FC = () => {
  return (
    <div className="container px-4 mx-auto mt-20">
      <div className="mx-auto text-center">
        <h2 className="text-5xl font-bold mt-10 mb-7">Náš příběh</h2>
      </div>
      <div className="relative">
        {/* <FloatingImages /> */}
        <video
          width="100%"
          className="sm:aspect-video bg-black relative"
          controls
        >
          <source src="/our-story.webm" type="video/webm" />
          <source src="/our-story.min.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
