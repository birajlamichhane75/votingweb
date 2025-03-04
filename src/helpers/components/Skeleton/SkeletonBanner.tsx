import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function SkeletonBanner({ isLoading }: any) {
    return (
        <div className="flex flex-col gap-4 bg-[var(--pagebg)] ">
            <Card className=" space-y-5 " radius="lg">
                <Skeleton isLoaded={isLoading} className="rounded-lg" >
                    <div className="h-[80vh] rounded-lg bg-[#efefef] w-24"></div>
                </Skeleton>
            </Card>
        </div>
    );
}
