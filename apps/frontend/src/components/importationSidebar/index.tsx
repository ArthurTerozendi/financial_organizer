import { useApi } from "../../services/api";
import { ApiRoutes } from "../../services/routes";
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../dropdown";
import CreateTagModal from "./createTagModal";
import { Tag, TransactionForm } from "./types";
import { Input } from "../input";
import { Transaction } from "../../pages/transactions/types";
import { DateTime } from "luxon";

interface ImportationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
  onCreatedTransaction: (transaction: Transaction) => void;
  onEditTransaction: (editedTransaction: Transaction) => void;
  loadTransactions: () => void;
}

const ImportationSidebar: FC<ImportationSidebarProps> = ({
  isOpen,
  onClose,
  editTransaction,
  onCreatedTransaction,
  onEditTransaction,
  loadTransactions,
}) => {
  const navigate = useNavigate();
  const { postRequest, getRequest, patchRequest } = useApi(navigate);
  const [tags, setTags] = useState<Tag[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState<TransactionForm>({
    date: editTransaction?.transactionDate || "",
    description: editTransaction?.description || "",
    tag: editTransaction?.tag?.id || "",
    type: editTransaction?.type || "Credit",
    value: editTransaction?.value || 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (editTransaction) {
      console.log(
        editTransaction.transactionDate,
        typeof editTransaction.transactionDate
      );
      setForm({
        date: DateTime.fromISO(editTransaction.transactionDate).toFormat(
          "yyyy-MM-dd'T'HH:mm"
        ),
        description: editTransaction.description,
        tag: editTransaction.tag?.id || "",
        type: editTransaction.type || "Credit",
        value: editTransaction.value || 0,
      });
    }
  }, [editTransaction]);

  const handleFormChange = useCallback(
    (value: string | number, key: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [setForm]
  );

  const clearForm = useCallback(() => {
    setForm({
      date: "",
      description: "",
      tag: "",
      type: "Credit",
      value: 0,
    });
  }, [setForm]);

  const showMessage = useCallback(
    (type: "success" | "error", text: string) => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 5000);
    },
    [setMessage]
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

  const handleCreateTransaction = useCallback(
    async (selectedTagName: string) => {
      const response = await postRequest<TransactionForm, Transaction>(
        ApiRoutes.transaction.create,
        {
          description: form.description,
          tag: selectedTagName,
          value: form.value,
          date: form.date,
          type: form.type,
        }
      );

      if (response.type === "error" || !response.data) {
        showMessage("error", "Erro ao criar transação. Tente novamente.");
      } else {
        showMessage("success", "Transação criada com sucesso!");
        clearForm();
        onCreatedTransaction(response.data);
      }
    },
    [clearForm, form, onCreatedTransaction, postRequest, showMessage]
  );

  const handleUpdateTransaction = useCallback(
    async (selectedTagName: string) => {
      const response = await patchRequest<TransactionForm, {transaction: Transaction}>(
        `${ApiRoutes.transaction.update}/${editTransaction?.id}`,
        {
          description: form.description,
          tag: selectedTagName,
          value: form.value,
          date: form.date,
          type: form.type,
        }
      );

      if (response.type === "error" || !response.data) {
        showMessage("error", "Erro ao atualizar transação. Tente novamente.");
      } else {
        showMessage("success", "Transação atualizada com sucesso!");
        clearForm();
        onEditTransaction(response.data.transaction);
        onClose();
      }
    },
    [
      clearForm,
      editTransaction?.id,
      form,
      onEditTransaction,
      patchRequest,
      showMessage,
      onClose,
    ]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = useCallback(
    async (e: { preventDefault: () => void }) => {
      e.preventDefault();

      if (!form) return;

      setLoading(true);
      setMessage(null);

      const selectedTagName =
        tags.find((t) => t.id === form.tag)?.name || form.tag;

      if (editTransaction) {
        await handleUpdateTransaction(selectedTagName);
      } else {
        await handleCreateTransaction(selectedTagName);
      }
      setLoading(false);
    },
    [
      form,
      tags,
      editTransaction,
      handleUpdateTransaction,
      handleCreateTransaction,
    ]
  );

  const handleUploadSubmit = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        const response = await postRequest<FormData, unknown>(
          ApiRoutes.transaction.uploadFile,
          formData
        );

        if (response.type === "error") {
          showMessage("error", "Erro ao importar arquivo. Tente novamente.");
        } else {
          showMessage("success", "Arquivo importado com sucesso!");
          loadTransactions();
          onClose();
        }

        setLoading(false);
      }
    },
    [loadTransactions, onClose, postRequest, showMessage]
  );

  const buttonText = useMemo(() => {
    if (loading && editTransaction) return "Atualizando...";
    if (editTransaction) return "Atualizar";
    if (loading) return "Criando...";
    return "Adicionar";
  }, [loading, editTransaction]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#2F3B51] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Importar Transações
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {message && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "success"
                    ? "bg-green-100 border border-green-400 text-green-700"
                    : "bg-red-100 border border-red-400 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form className="flex gap-6 flex-col" onSubmit={handleFormSubmit}>
              <Input
                label="Descrição"
                name="description"
                value={form.description}
                onChange={(e) =>
                  handleFormChange(e.target.value, "description")
                }
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
                    label="Recebido"
                    onChange={() => handleFormChange("Credit", "type")}
                    type="radio"
                    name="type-credit"
                    value="Credit"
                    checked={form.type === "Credit"}
                  />
                  <Input
                    label="Pago"
                    onChange={() => handleFormChange("Debit", "type")}
                    type="radio"
                    name="type-debit"
                    value="Debit"
                    checked={form.type === "Debit"}
                  />
                </div>
              </div>
              <Input
                name="date"
                label="Data"
                value={form.date}
                onChange={(e) => handleFormChange(e.target.value, "date")}
                type="datetime-local"
              />
              <div className="flex justify-end items-start">
                <button
                  className={`py-2 px-4 text-white rounded font-semibold text-sm ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple hover:bg-purple/90"
                  }`}
                  onClick={(e) => handleFormSubmit(e)}
                  disabled={loading}
                >
                  {buttonText}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-600">
              <label
                htmlFor="uploadFile"
                className={`block w-full py-2 px-4 text-white rounded font-semibold text-sm cursor-pointer text-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple hover:bg-purple/90"
                }`}
                title="Importar arquivo OFX"
              >
                {loading ? "Importando..." : "Importar Extrato (OFX)"}
              </label>
              <input
                id="uploadFile"
                name="bankStatement"
                type="file"
                onChange={handleUploadSubmit}
                hidden={true}
                accept=".ofx"
                disabled={loading}
              />
            </div>
          </div>
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
    </>
  );
};

export default ImportationSidebar;
