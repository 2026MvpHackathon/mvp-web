import * as S from './style'
import Img from '../../../../../public/img/drone.png'

export default function Recent() {
  return (
    <>
      <S.container>
        <S.item>
          <S.infoContainer>
            <S.titleTimeContainer>
              <S.title>Drone</S.title>
              <S.time>10분 전</S.time>
            </S.titleTimeContainer>

            <S.detail>원격 제어하거나 자율 비행하는 무인 항공기</S.detail>
          </S.infoContainer>

          <S.bottom>
            <S.openButtonContainer>
              <S.openButton>열기</S.openButton>
            </S.openButtonContainer>
          < S.img src={Img}/>
          </S.bottom>
        </S.item>
      </S.container>
    </>
  )
}