import { Input } from "../../components/input";
import { useApi } from "../../services/api";
import { ApiRoutes } from "../../services/routes";
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Tag, TransactionForm } from "./types";
import { useNavigate } from "react-router-dom";
import { PageEnum, Pages } from "../../components/sidebar/types";
import DashboardLayout from "../../layouts/dashboard";
import Dropdown from "../../components/dropdown";
import CreateTagModal from "./createTagModal";

const Importation: FC = () => {
  const navigate = useNavigate();
  const { postRequest, getRequest } = useApi(navigate);
  const [tags, setTags] = useState<Tag[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<TransactionForm>({
    date: "",
    description: "",
    tag: "",
    type: "Credit",
    value: 0,
  });

  const handleFormChange = useCallback(
    (value: string | number, key: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [setForm]
  );

  const getTags = useCallback(async () => {
    const response = await getRequest<Record<string, never>, { tags: Tag[] }>(
      ApiRoutes.tag
    );
    setTags(response.data?.tags || []);
  }, [getRequest, setTags]);

  useEffect(() => {
    getTags();
  }, [getTags]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      if (!form) return;
      
      const selectedTagName = tags.find((t) => t.id === form.tag)?.name || form.tag;

      await postRequest<TransactionForm, TransactionForm>(
        ApiRoutes.transaction.create,
        {
          description: form.description,
          tag: selectedTagName,
          value: form.value,
          date: form.date,
          type: form.type,
        }
      );
    },
    [postRequest, form, tags]
  );

  const handleUploadSubmit = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await postRequest<FormData, unknown>(
          ApiRoutes.transaction.uploadFile,
          formData
        );
      }
    },
    [postRequest]
  );

  return (
    <DashboardLayout
      currentPage={PageEnum.Importations}
      title={Pages[PageEnum.Importations].label}
    >
      <div className="flex flex-row w-full">
        <form
          className="flex gap-8 flex-col mt-8 w-2/6 h-full"
          onSubmit={handleFormSubmit}
        >
          <Input
            label="Descrição"
            value={form.description}
            onChange={(e) => handleFormChange(e.target.value, "description")}
            type="text"
          />
          <Dropdown
            label="Categoria"
            selectedValue={form.tag}
            onChange={handleFormChange}
            options={tags}
            openModal={() => {
              setOpenModal(true);
            }}
          />
          <div className="flex flex-row gap-3 items-center">
            <div className="w-1/2">
              <Input
                label="Valor"
                value={form.value}
                onChange={(e) =>
                  handleFormChange(e.target.valueAsNumber, "value")
                }
                type="number"
              />
            </div>
            <div className="w-1/2 flex flex-row gap-2 mt-4">
              <Input
                label="Crédito"
                onChange={() => handleFormChange("Credit", "type")}
                type="radio"
                name="type-credit"
                value="Credit"
                checked={form.type === "Credit"}
              />
              <Input
                label="Débito"
                onChange={() => handleFormChange("Debit", "type")}
                type="radio"
                name="type-debit"
                value="Debit"
                checked={form.type === "Debit"}
              />
            </div>
          </div>
          <Input
            label="Data"
            value={form.date}
            onChange={(e) => handleFormChange(e.target.value, "date")}
            type="datetime-local"
          />
          <div className="flex justify-end items-start">
            <button
              className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm"
              onClick={(e) => handleFormSubmit(e)}
            >
              Criar
            </button>
          </div>
        </form>
        <div className="flex justify-end items-start w-4/6 mt-8 pr-2">
          <label
            htmlFor="uploadFile"
            className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm cursor-pointer"
            title="Importar arquivo OFX"
          >
            Importar Extrato{" "}
          </label>
          <input
            id="uploadFile"
            name="bankStatement"
            type="file"
            onChange={handleUploadSubmit}
            hidden={true}
            accept=".ofx"
          />
        </div>
      </div>
      <CreateTagModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        setTags={setTags}
        onTagCreated={(tagId) => {
          handleFormChange(tagId, "tag");
          setOpenModal(false);
        }}
      />
    </DashboardLayout>
  );
};

export default Importation;
