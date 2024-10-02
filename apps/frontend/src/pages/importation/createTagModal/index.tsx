import { Box, Fade, Modal, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { Input } from "../../../components/input";
import { useApi } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { ApiRoutes } from "../../../services/routes";

interface CreateTagModalProps {
  open: boolean;
  onClose: () => void;
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

const CreateTagModal: FC<CreateTagModalProps> = ({ open, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    color: "",
  });
  const navigate = useNavigate();
  const { postRequest } = useApi(navigate);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }, [form]);

  const createTag = useCallback(() => {
    postRequest(ApiRoutes.tag, form);
  }, [postRequest, form]);

  const handleSubmit = useCallback(() => {
    createTag();
    onClose();
  }, [createTag, onClose]);

  useEffect(() => {
    console.log(form);
  }, [form]);

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
              <Input
                label="Cor"
                type="color"
                name="color"
                value={form.color}
                onChange={handleFormChange}
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
      {/* <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">Criar nova categoria</h1>
      </div> */}
    </Modal>
  );
};

export default CreateTagModal;
