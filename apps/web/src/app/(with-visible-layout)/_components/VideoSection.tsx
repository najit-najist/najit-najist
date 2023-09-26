import { FC } from 'react';

// import { FloatingImages } from './FloatingImages';

export const VideoSection: FC = () => {
  return (
    <div className="container px-4 mx-auto mt-20" id="o-nas">
      <div className="mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-bold mt-10 mb-7 font-title">
          Náš příběh
        </h2>
      </div>
      <div className="relative">
        {/* <FloatingImages /> */}
        <video
          poster="/images/video-thumbnail.jpg"
          width="100%"
          className="sm:aspect-video bg-black relative shadow-lg shadow-deep-green-300"
          controls
        >
          <source src="/api/videos/intro" type="video/webm" />
          <source src="/api/videos/intro?type=mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
