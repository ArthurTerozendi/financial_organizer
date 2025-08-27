import { Box, Fade, Modal, Typography } from "@mui/material";
import { FC, useCallback, useState, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "../types";
import { useApi } from "../../../services/api";
import { ApiRoutes } from "../../../services/routes";
import { ColorPicker } from "../../colorPicker";
import { Input } from "../../input";

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
  setTags: Dispatch<SetStateAction<Tag[]>>;
  onTagCreated?: (tagId: string) => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 5,
  borderRadius: "0.375rem",
  backgroundColor: "#2F3B51",
  p: 4,
};

const CreateTagModal: FC<CreateTagModalProps> = ({ open, onClose, setTags, onTagCreated }) => {
  const [form, setForm] = useState({
    name: "",
    color: "",
  });
  const navigate = useNavigate();
  const { postRequest } = useApi(navigate);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, [form]);

  const handleColorChange = useCallback((color: string) => {
    setForm({ ...form, color });
  }, [form]);

  const createTag = useCallback(() => {
    const newTagId = crypto.randomUUID();
    postRequest(ApiRoutes.tag, {...form, id: newTagId});
    setTags((tags) => [...tags, {
        id: newTagId,
        name: form.name,
        color: form.color,
      },
    ]);
    if (onTagCreated) {
      onTagCreated(newTagId);
    }
  }, [postRequest, form, setTags, onTagCreated]);

  const handleSubmit = useCallback(() => {
    createTag();
    onClose();
  }, [createTag, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Criar nova categoria
          </Typography>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <Input
                label="Nome"
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
              />
              <ColorPicker
                label="Cor"
                name="color"
                value={form.color}
                onChange={handleColorChange}
              />
            </div>
            <div className="flex justify-end items-start">
              <button
                className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm"
                onClick={handleSubmit}
              >
                Criar
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateTagModal;
