"use client";
import HeroHomeSVP from "../templates/HeroHomeSVP";

interface HomeSVPProps {
  imageHero: string;
}

export default function HomeSVP({ imageHero }: HomeSVPProps) {
  return (
    <div className="root relative items-center">
      <HeroHomeSVP imageHero={imageHero} />
    </div>
  );
}
