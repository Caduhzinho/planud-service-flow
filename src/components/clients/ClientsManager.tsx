import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, MapPin, Edit, Trash2, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AddClientForm } from './AddClientForm';
import { toast } from 'sonner';

interface Client {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  endereco: string | null;
  observacoes: string | null;
  created_at: string;
}

export const ClientsManager = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const fetchClients = async () => {
    if (!user?.id) return;

    try {
      console.log('Buscando clientes com RLS...');
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Clientes carregados:', data?.length || 0);
      setClients(data || []);
      setFilteredClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const exportClients = () => {
    const csvContent = [
      ['Nome', 'Telefone', 'Email', 'Endereço', 'Observações'],
      ...clients.map(client => [
        client.nome,
        client.telefone,
        client.email || '',
        client.endereco || '',
        client.observacoes || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Lista de clientes exportada com sucesso!');
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedClients.length} cliente(s)?`)) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .in('id', selectedClients);

      if (error) throw error;

      toast.success(`${selectedClients.length} cliente(s) excluído(s) com sucesso!`);
      setSelectedClients([]);
      fetchClients();
    } catch (error) {
      console.error('Erro ao excluir clientes:', error);
      toast.error('Erro ao excluir clientes');
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefone.includes(searchTerm)
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      toast.success('Cliente excluído com sucesso!');
      fetchClients();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Clientes
          </h1>
          <p className="text-gray-600">
            Gerencie seu portfólio de clientes ({clients.length} clientes)
          </p>
        </div>
        <div className="flex gap-2">
          {selectedClients.length > 0 && (
            <Button 
              variant="destructive"
              onClick={handleBulkDelete}
              className="h-11 px-4 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir ({selectedClients.length})
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={exportClients}
            className="h-11 px-4 rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Clientes */}
      {filteredClients.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm ? 'Nenhum cliente encontrado para a busca.' : 'Nenhum cliente cadastrado ainda.'}
          </div>
          {!searchTerm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              variant="outline" 
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedClients([...selectedClients, client.id]);
                    } else {
                      setSelectedClients(selectedClients.filter(id => id !== client.id));
                    }
                  }}
                  className="rounded border-gray-300"
                />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {getInitials(client.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.nome}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{client.telefone}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Cliente
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                {client.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.endereco && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{client.endereco}</span>
                  </div>
                )}
                {client.observacoes && (
                  <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium">Obs:</span> {client.observacoes}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 h-9 rounded-lg">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 rounded-lg text-red-600 hover:bg-red-50"
                  onClick={() => handleDeleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddClientForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onClientAdded={fetchClients}
      />
    </div>
  );
};
