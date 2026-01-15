/**
 * EXEMPLO DE USO COMPLETO
 * 
 * Este arquivo demonstra como usar o sistema de tabelas seguindo
 * o padrão de arquitetura do projeto:
 * 
 * - Page: Orquestração geral
 * - View: Camada visual
 * - Hook: Regras de negócio e estado
 * - Types: Tipagens centralizadas
 */

// ============================================================================
// types.ts - Tipagens da página
// ============================================================================

import type { FilterMap } from '@prime-repo/shared';

/**
 * Tipo do usuário (vindo da API)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  createdAt: string;
}

/**
 * Filtros disponíveis para usuários
 */
export interface UserFilters extends FilterMap {
  search?: string;
  status?: string[];
  role?: string;
}

// ============================================================================
// hook.ts - Hook da página (orquestrador)
// ============================================================================

import { useCallback } from 'react';
import { useTableQuery } from '@prime-repo/shared';
// import { userService } from '@/services/user.service'; // Seu service de API

/**
 * Hook que orquestra a página de usuários
 * 
 * IMPORTANTE sobre refresh da página:
 * - Ao dar F5 ou compartilhar URL, o estado é restaurado automaticamente
 * - A URL ?page=2&ordering=-name&search=john&status=active,inactive
 *   será parseada e aplicada aos filtros, paginação e ordenação
 * - Os inputs de filtro já aparecem preenchidos com os valores da URL
 */
export function useUsersPage() {
  // Hook principal da tabela
  const table = useTableQuery<User, UserFilters>({
    fetchFn: async (params) => {
      // Aqui você chama sua API
      // return userService.list(params);
      
      // Mock para demonstração
      console.log('Fetching with params:', params);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dados mockados
      return {
        results: [
          { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'active', role: 'admin', createdAt: '2024-01-15' },
          { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'active', role: 'user', createdAt: '2024-01-16' },
          { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'inactive', role: 'user', createdAt: '2024-01-17' },
          { id: 4, name: 'Ana Oliveira', email: 'ana@email.com', status: 'pending', role: 'manager', createdAt: '2024-01-18' },
        ],
        count: 50
      };
    },
    initialPageSize: 10,
    initialOrdering: '-createdAt',
    initialFilters: {},
    syncWithUrl: true,
    
    // IMPORTANTE: Declare campos que são arrays!
    // Isso é necessário para que a URL seja parseada corretamente no refresh
    // Ex: ?status=active,inactive será convertido para ['active', 'inactive']
    arrayFields: ['status']
  });

  // Ação de editar usuário
  const handleEdit = useCallback((user: User) => {
    console.log('Editing user:', user);
    // navigate(`/users/${user.id}/edit`);
  }, []);

  // Ação de deletar usuário
  const handleDelete = useCallback((user: User) => {
    console.log('Deleting user:', user);
    // Após deletar, refetch
    // await userService.delete(user.id);
    // table.refetch();
  }, []);

  return {
    // Estado da tabela
    ...table,
    
    // Ações da página
    handleEdit,
    handleDelete
  };
}

// ============================================================================
// view.tsx - Camada visual
// ============================================================================

import React from 'react';
import { DataTable, Column, TableFilters, FilterField } from '@prime-repo/ui';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

interface UsersViewProps {
  data: User[];
  totalRecords: number;
  isLoading: boolean;
  pagination: ReturnType<typeof useUsersPage>['pagination'];
  sorting: ReturnType<typeof useUsersPage>['sorting'];
  filters: ReturnType<typeof useUsersPage>['filters'];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

/**
 * Opções de status para filtro
 */
const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' },
  { label: 'Pendente', value: 'pending' }
];

/**
 * Opções de papel para filtro
 */
const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Gerente', value: 'manager' },
  { label: 'Usuário', value: 'user' }
];

/**
 * Componente visual da página de usuários
 */
export function UsersView({
  data,
  totalRecords,
  isLoading,
  pagination,
  sorting,
  filters,
  onEdit,
  onDelete
}: UsersViewProps) {
  
  // ============================================================================
  // TEMPLATES DE COLUNA
  // ============================================================================
  
  const statusTemplate = (user: User) => {
    const severityMap: Record<string, 'success' | 'danger' | 'warning'> = {
      active: 'success',
      inactive: 'danger',
      pending: 'warning'
    };
    
    const labelMap: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente'
    };

    return (
      <Tag 
        value={labelMap[user.status]} 
        severity={severityMap[user.status]} 
      />
    );
  };

  const actionsTemplate = (user: User) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm"
        onClick={() => onEdit(user)}
        tooltip="Editar"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-danger p-button-sm"
        onClick={() => onDelete(user)}
        tooltip="Excluir"
      />
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="users-page">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
        <Button 
          label="Novo Usuário" 
          icon="pi pi-plus" 
          className="p-button-primary"
        />
      </div>

      {/* Filtros */}
      <TableFilters 
        filters={filters}
        layout="grid"
        columns={4}
        loading={isLoading}
      >
        <FilterField label="Buscar">
          <InputText
            value={filters.draft.search ?? ''}
            onChange={e => filters.setDraftValue('search', e.target.value)}
            placeholder="Nome ou email..."
          />
        </FilterField>
        
        <FilterField label="Status">
          <MultiSelect
            value={filters.draft.status ?? []}
            options={statusOptions}
            onChange={e => filters.setDraftValue('status', e.value)}
            placeholder="Selecione..."
            className="w-full"
          />
        </FilterField>
        
        <FilterField label="Papel">
          <Dropdown
            value={filters.draft.role ?? ''}
            options={roleOptions}
            onChange={e => filters.setDraftValue('role', e.value)}
            placeholder="Selecione..."
            showClear
            className="w-full"
          />
        </FilterField>
      </TableFilters>

      {/* Tabela - Usando columns prop */}
      <DataTable
        data={data}
        columns={[
          { field: 'id', header: 'ID', sortable: true, width: '80px' },
          { field: 'name', header: 'Nome', sortable: true },
          { field: 'email', header: 'Email', sortable: true },
          { field: 'status', header: 'Status', sortable: true, body: statusTemplate },
          { field: 'role', header: 'Papel', sortable: true },
          { field: 'createdAt', header: 'Criado em', sortable: true },
          { field: 'id', header: 'Ações', body: actionsTemplate, width: '120px' }
        ]}
        pagination={{ ...pagination, totalRecords }}
        sorting={sorting}
        loading={isLoading}
      />

      {/* Ou usando children (alternativa) */}
      {/* 
      <DataTable
        data={data}
        pagination={{ ...pagination, totalRecords }}
        sorting={sorting}
        loading={isLoading}
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Nome" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="status" header="Status" sortable body={statusTemplate} />
        <Column field="role" header="Papel" sortable />
        <Column field="createdAt" header="Criado em" sortable />
        <Column field="id" header="Ações" body={actionsTemplate} />
      </DataTable>
      */}
    </div>
  );
}

// ============================================================================
// page.tsx - Orquestração da página
// ============================================================================

/**
 * Página de usuários
 * Conecta o hook com a view
 */
export function UsersPage() {
  const {
    data,
    totalRecords,
    isLoading,
    pagination,
    sorting,
    filters,
    handleEdit,
    handleDelete
  } = useUsersPage();

  return (
    <UsersView
      data={data}
      totalRecords={totalRecords}
      isLoading={isLoading}
      pagination={pagination}
      sorting={sorting}
      filters={filters}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================

export default UsersPage;
