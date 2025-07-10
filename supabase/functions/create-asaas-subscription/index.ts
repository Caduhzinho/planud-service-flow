import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { empresa_id, plano_id, forma_pagamento } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get company and plan data
    const { data: empresa } = await supabaseClient
      .from('empresas')
      .select('nome')
      .eq('id', empresa_id)
      .single()

    const { data: plano } = await supabaseClient
      .from('planos')
      .select('*')
      .eq('id', plano_id)
      .single()

    const { data: usuario } = await supabaseClient
      .from('usuarios')
      .select('email')
      .eq('empresa_id', empresa_id)
      .eq('tipo', 'admin')
      .single()

    if (!empresa || !plano || !usuario) {
      throw new Error('Dados não encontrados')
    }

    // Create ASAAS charge
    const asaasResponse = await fetch('https://www.asaas.com/api/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUxYjAwMzdiLWRjOWEtNDI0Ny1hY2EzLWJkMjg4NTU2MzRjODo6JGFhY2hfZThiZTg5ZDItMmE3Yi00YzcwLTk5YTAtNTBhYzVjODUxMmRk',
      },
      body: JSON.stringify({
        customer: usuario.email,
        billingType: forma_pagamento.toUpperCase(),
        value: plano.preco_mensal,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        description: `Assinatura ${plano.nome} - ${empresa.nome}`,
        externalReference: empresa_id,
      }),
    })

    const asaasData = await asaasResponse.json()

    if (!asaasResponse.ok) {
      throw new Error(`ASAAS Error: ${JSON.stringify(asaasData)}`)
    }

    // Save subscription to database
    const { error } = await supabaseClient
      .from('assinaturas')
      .insert({
        empresa_id,
        plano_id,
        status: 'pendente',
        forma_pagamento,
        vencimento: asaasData.dueDate,
        link_pagamento: asaasData.invoiceUrl,
        id_asaas: asaasData.id,
        ativa: false,
      })

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        link_pagamento: asaasData.invoiceUrl,
        id_asaas: asaasData.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
