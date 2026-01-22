"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArticleList } from "../indexes/ArticleListSVP";

dayjs.extend(relativeTime);

interface SwiperArticlesSVPProps {
  articleList: ArticleList[];
}

export default function SwiperArticlesSVP(props: SwiperArticlesSVPProps) {
  return (
    <>
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="swiper-articles"
      >
        {props.articleList.map((post, index) => (
          <SwiperSlide
            className="pb-10"
            key={index}
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              className="block"
              key={post.id}
              href={`/insights/${post.slug_url}/${post.id}`}
            >
              <div className="headline relative inline-block w-full overflow-hidden">
                <Image
                  className="w-full object-cover aspect-video"
                  src={post.image_url}
                  alt={post.title}
                  width={360}
                  height={360}
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
