// Exercise the native Yoga implementation shipped with this React Native version.
#include <yoga/Yoga.h>
#include <cassert>
#include <cmath>
#include <cstdio>
#include <initializer_list>
static void absoluteFill(YGNodeRef n){YGNodeStyleSetPositionType(n,YGPositionTypeAbsolute);for(auto e:{YGEdgeLeft,YGEdgeTop,YGEdgeRight,YGEdgeBottom})YGNodeStyleSetPosition(n,e,0);}
int main(){
 auto config=YGConfigNew();YGConfigSetErrata(config,YGErrataAll);YGConfigSetPointScaleFactor(config,0);
 for(auto width:{148.f,220.f,300.f}){
  const float height=width==300?52:62,px=width==300?34:28,py=width==300?0:18;
  auto old=YGNodeNewWithConfig(config);YGNodeStyleSetWidth(old,width);YGNodeStyleSetHeight(old,height);YGNodeStyleSetPadding(old,YGEdgeHorizontal,px);YGNodeStyleSetPadding(old,YGEdgeVertical,py);
  auto oldImage=YGNodeNewWithConfig(config);absoluteFill(oldImage);YGNodeStyleSetWidthPercent(oldImage,100);YGNodeStyleSetHeightPercent(oldImage,100);YGNodeInsertChild(old,oldImage,0);YGNodeCalculateLayout(old,YGUndefined,YGUndefined,YGDirectionLTR);
  assert(std::abs(YGNodeLayoutGetWidth(oldImage)-(width-2*px))<.01);
  assert(std::abs(YGNodeLayoutGetHeight(oldImage)-(height-2*py))<.01);
  auto fixed=YGNodeNewWithConfig(config);YGNodeStyleSetWidth(fixed,width);YGNodeStyleSetHeight(fixed,height);YGNodeStyleSetPadding(fixed,YGEdgeHorizontal,px);YGNodeStyleSetPadding(fixed,YGEdgeVertical,py);
  auto layer=YGNodeNewWithConfig(config);absoluteFill(layer);YGNodeInsertChild(fixed,layer,0);
  auto image=YGNodeNewWithConfig(config);YGNodeStyleSetWidthPercent(image,100);YGNodeStyleSetHeightPercent(image,100);YGNodeInsertChild(layer,image,0);YGNodeCalculateLayout(fixed,YGUndefined,YGUndefined,YGDirectionLTR);
  assert(YGNodeLayoutGetWidth(image)==width&&YGNodeLayoutGetHeight(image)==height);assert(YGNodeLayoutGetLeft(layer)==0&&YGNodeLayoutGetTop(layer)==0);
  std::printf("Native Yoga: %.0fx%.0f padded parent: old image %.0fx%.0f; fixed image %.0fx%.0f PASS\n",width,height,YGNodeLayoutGetWidth(oldImage),YGNodeLayoutGetHeight(oldImage),YGNodeLayoutGetWidth(image),YGNodeLayoutGetHeight(image));
  YGNodeFreeRecursive(old);YGNodeFreeRecursive(fixed);
 }
 YGConfigFree(config);
}
