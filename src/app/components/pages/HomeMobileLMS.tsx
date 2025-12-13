"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import ProductItemMobileLMS from "../items/ProductItemMobileLMS";
import EmptyListLMS from "../states/EmptyListLMS";

export interface CohortListMobile {
  id: number;
  name: string;
  image: string;
  status: StatusType;
}

export interface PlaylistMobile {
  id: number;
  name: string;
  image_url: string;
  status: StatusType;
}

interface HomeMobileLMSProps extends AvatarBadgeLMSProps {
  cohortList: CohortListMobile[];
  playlist: PlaylistMobile[];
}

export default function HomeMobileLMS(props: HomeMobileLMSProps) {
  const nickName = props.sessionUserName.split(" ")[0];

  const activeCohorts = props.cohortList.filter(
    (cohort) => cohort.status === "ACTIVE"
  );
  const activePlaylists = props.playlist.filter(
    (playlist) => playlist.status === "ACTIVE"
  );

  return (
    <div className="root-page flex flex-col w-full items-center pb-20 lg:hidden">
      <div className="greetings-content flex flex-col w-full p-5 pt-10 pb-10 bg-tertiary text-white">
        <p className="greetings-for font-bodycopy font-semibold text-lg">
          Welcome, {nickName}!
        </p>
        <p className="greetings-word font-bodycopy font-medium text-[#ffffff]/80">
          Let’s drive your business forward
        </p>
      </div>
      <div className="bootcamp-programs flex flex-col w-full h-full gap-3 p-5">
        <h2 className="section-title font-bodycopy font-bold">My Learning</h2>
        <div className="index w-full flex flex-col">
          <div className="product-list flex flex-col gap-2">
            {activeCohorts.map((post, index) => (
              <ProductItemMobileLMS
                key={index}
                productId={post.id}
                productName={post.name}
                productImage={post.image}
                productCategory="COHORT"
              />
            ))}
            {activePlaylists.map((post, index) => (
              <ProductItemMobileLMS
                key={index}
                productId={post.id}
                productName={post.name}
                productImage={post.image_url}
                productCategory="PLAYLIST"
              />
            ))}
          </div>
          {activeCohorts.length === 0 && activePlaylists.length === 0 && (
            <EmptyListLMS
              stateTitle="No Program Purchased Yet"
              stateDescription="Looks like you haven’t bought any products. Explore our collections
                            and start learning something new today!"
              stateAction="Explore our Program"
            />
          )}
        </div>
      </div>
    </div>
  );
}
