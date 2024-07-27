// components/shared/ClickableBadge.tsx
import { Badge } from "@saasfly/ui/badge";

export function UserBadge({ customerId, userId, variant, onClick }) {
  const handleClick = (e) => {
    onClick(customerId);
  };

  return (
    <Badge
      className="cursor-pointer text-xs"
      variant={variant}
      onClick={handleClick}
    >
      {userId}
    </Badge>
  );
}
