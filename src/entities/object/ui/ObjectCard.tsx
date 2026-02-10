import * as S from "./ObjectCard.Style";
import Arrow from "@/assets/openArrow.png";
import type { ObjectCardItem } from "@/features/object/useObjectList";
import { useEffect } from "react";

interface Props {
  item: ObjectCardItem;
  onOpen?: () => void;
}

const getCorrectImagePath = (thumbnailUrl: string) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const path = thumbnailUrl.replace(baseUrl, ""); // Remove base URL if present

  switch (path) {
    case "/thumbnails/drone_main.jpg":
      return "/img/drone.png"; // Adjusted to public/img/drone.png
    case "/thumbnails/leaf_spring.jpg":
      return "/assets/Leaf Spring/판스프링 조립도.png";
    case "/thumbnails/robot_arm.jpg":
      return "/assets/Robot Arm/로보팔 조립도.png";
    case "/thumbnails/robot_gripper.jpg":
      return "/assets/Robot Gripper/로봇집게 조립도.png";
    case "/thumbnails/suspension.jpg":
      return "/assets/Suspension/서스펜션 조립도.png";
    case "/thumbnails/v4_engine.jpg":
      return "/assets/V4_Engine/V4실린더 엔진 조립도.png";
    default:
      return thumbnailUrl; // Fallback to original if no match
  }
};

const ObjectCard = ({ item, onOpen }: Props) => {
  useEffect(() => {
    console.log("image path:", getCorrectImagePath(item.image));
  }, [item.image]);

  return (
    <S.container onClick={onOpen}>
      <S.infoContainer>
        <S.titleArrowContainer>
          <S.title>{item.title}</S.title>
          <S.openArrow src={Arrow} />
        </S.titleArrowContainer>

        <S.detail>{item.detail}</S.detail>
      </S.infoContainer>

      <S.objectImg src={getCorrectImagePath(item.image)} />
    </S.container>
  );
};

export default ObjectCard;

