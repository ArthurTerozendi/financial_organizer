'use client'

import { Input } from "@/components/input";
import { useApi } from "@/services/api";
import { ApiRoutes } from "@/services/routes";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback } from "react";

const Importation = () => {
  const router = useRouter();
  const { postRequest } = useApi(router);

  const handleFormSubmit = useCallback(async () => {
    // e.preventDefault();
    
    const response = await postRequest<
      {description: string, tag: string, data: Date, type: string, value: number},
      {description: string, tag: string, data: Date, type: string, value: number}>
    (ApiRoutes.transaction.create, {
        description: 'z.string()',
        tag: 'z.string()',
        value: 0,
        data: new Date(),
        type: 'z.string()',
    });

    console.log(response)
  }, [postRequest]);


  const handleUploadSubmit = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

     if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await postRequest<FormData, any>(ApiRoutes.transaction.uploadFile, formData)

      console.log(response);
    }
  }, [postRequest])

  return (
    <div className="flex flex-row w-full">
      <div className="flex gap-8 flex-col mt-8 w-2/6 h-full">
        <Input label="Descrição" value="" onChange={() => {}} type="text" />
        <Input label="Categoria" value="" onChange={() => {}} type="text" />
        <Input label="Valor" value="" onChange={() => {}} type="text" />
        <Input label="Data" value="" onChange={() => {}} type="date" />
        <div className="flex justify-end items-start">
          <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm" onClick={handleFormSubmit} > Criar </button>
        </div>
      </div>
      <div className="flex justify-end items-start w-4/6 mt-8 pr-2">
        <label htmlFor="uploadFile" className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm cursor-pointer" title="Importar arquivo OFX">Importar Extrato </label>
        <input id='uploadFile' name="bankStatement" type="file" onChange={handleUploadSubmit} hidden={true} accept=".ofx"/>
      </div>
    </div>
  );
}

export default Importation;