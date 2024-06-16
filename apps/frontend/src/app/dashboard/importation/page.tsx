'use client'

import { Input } from "@/components/input";
import { useApi } from "@/services/api";
import { ApiRoutes } from "@/services/routes";
import { Db, Prisma } from "@financial-organizer/db";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback } from "react";

const Importation = () => {
  const router = useRouter();
  const { postRequest } = useApi(router);

  const handleSubmit = useCallback(async () => {
    // e.preventDefault();
    
    const response = await postRequest<{description: string, tag: string, data: Date, type: string, value: number}, {description: string, tag: string, data: Date, type: string, value: number}>(ApiRoutes.transaction, {
        description: 'z.string()',
        tag: 'z.string()',
        value: 0,
        data: new Date(),
        type: 'z.string()',
    });

    console.log(response)
  }, [postRequest]);

  return (
    <div className="flex flex-row w-full">
      <div className="flex gap-8 flex-col mt-8 w-2/6 h-full">
        <Input label="Descrição" value="" onChange={() => {}} type="text" />
        <Input label="Categoria" value="" onChange={() => {}} type="text" />
        <Input label="Valor" value="" onChange={() => {}} type="text" />
        <Input label="Data" value="" onChange={() => {}} type="date" />
        <div className="flex justify-end items-start">
          <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm" onClick={handleSubmit} > Criar </button>
        </div>
      </div>
      <div className="flex justify-end items-start w-4/6 mt-8 pr-2">
        <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm" title="Importar arquivo OFX"> Importar Extrato </button>
      </div>
    </div>
  );
}

export default Importation;