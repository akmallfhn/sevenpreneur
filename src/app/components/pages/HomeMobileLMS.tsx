"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import ProductItemMobileLMS from "../items/ProductItemMobileLMS";
import EmptyListLMS from "../states/EmptyListLMS";
import { CourseList } from "../tabs/CourseTabsLMS";

interface HomeMobileLMSProps extends AvatarBadgeLMSProps {
  courseList: CourseList[];
}

export default function HomeMobileLMS(props: HomeMobileLMSProps) {
  const nickName = props.sessionUserName.split(" ")[0];

  const activeCourse = props.courseList.filter(
    (course) => course.status === "ACTIVE",
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
            {activeCourse.map((post) => (
              <ProductItemMobileLMS
                key={post.id}
                productId={post.id}
                productName={post.name}
                productImage={post.image_url}
                productCategory={post.category}
              />
            ))}
          </div>
          {activeCourse.length === 0 && (
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
