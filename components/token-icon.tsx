import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BasketToken } from "@/lib/types";
import { cn } from "@/lib/utils";
export const TokenIcon = ({
    token,
    size = "large",
}: {
    token: BasketToken;
    size?: "small" | "large";
}) => {
    return (
        <Avatar className={cn(size === "small" && "size-6")}>
            <AvatarImage src={token.imageUrl} alt={token.name} />
            <AvatarFallback>
                {token.symbol.startsWith("$")
                    ? token.symbol[1]
                    : token.symbol[0]}
            </AvatarFallback>
        </Avatar>
    );
};
