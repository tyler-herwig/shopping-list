import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateListItem } from "../api/lists";
import { IListItem } from "../models/lists";

interface ListItemCheckboxProps {
    listItem: IListItem;
    onClick: () => void;
}

const ListItemCheckbox: React.FC<ListItemCheckboxProps> = ({ listItem, onClick }) => {
    const queryClient = useQueryClient();
    const [checked, setChecked] = useState<boolean | null | undefined>(listItem.purchased);

    const updateMutation = useMutation({
        mutationFn: (updatedItem: IListItem) => updateListItem(listItem.id, updatedItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["listItems"] });
        }
    });

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = event.target.checked;
        setChecked(newChecked);

        updateMutation.mutate({
            ...listItem,
            purchased: newChecked
        });

        if (onClick) {
            onClick();
        }
    };

    return (
        <Checkbox 
            checked={checked ?? false} 
            onChange={handleCheckboxChange}
            onClick={ (e) => e.stopPropagation() }
        />
    );
};

export default ListItemCheckbox;