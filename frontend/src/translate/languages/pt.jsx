import { permission } from "process";

const messages = {
  pt: {
    translations: {
      languages: {
        undefined: "Idioma",
        ptBr: "Português",
        es: "Español",
        en: "English",
        tr: "Türkçe",
      },
      signup: {
        title: "Cadastre-se",
        toasts: {
          success: "Usuário criado com sucesso! Faça seu login!!!.",
          fail: "Erro ao criar usuário. Verifique os dados informados.",
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha",
        },
        buttons: {
          submit: "Cadastrar",
          login: "Já tem uma conta? Entre!",
          returlogin: "Voltar ao menu principal",
          send: "Enviar E-mail",
        },
      },
      login: {
        title: "Login",
        title2: "Fazer login",
        form: {
          email: "Email",
          password: "Senha",
        },
        buttons: {
          submit: "Entrar",
          register: "Não tem um conta? Cadastre-se!",
          returlogin: "Voltar ao menu principal",
          send: "Enviar E-mail",
        },
      },
      resetpswd: {
        title2: "Redefinir senha",
        toasts: {
          success:
            "Verifique a caixa de entrada de seu email para continuarmos!",
          resetsucess:
            "Senha redefinida com sucesso, volte a tela de login para entrar na plataforma!",
          fail: "Erro ao criar redefinir senha. Verifique o token informado.",
        },
      },
      plans: {
        form: {
          name: "Nome",
          users: "Usuários",
          connections: "Conexões",
          queue: "Filas",
          campaigns: "Campanhas",
          schedules: "Agendamentos",
          email: "E-mail",
          chat: "Chat Interno",
          isVisible: "Mostrar",
          delete: "Deseja realmente excluir esse registro?",
          api: "Api Externa",
          kanban: "Kanban",
          whiteLabel: "Estilizador",
          integrations: "Integrações",
          enabled: "Habilitadas",
          disabled: "Desabilitadas",
          clear: "Cancelar",
          delete: "Excluir",
          save: "Salvar",
          yes: "Sim",
          no: "Não",
          money: "R$",
        },
      },
      companies: {
        title: "Cadastrar Empresa",
        form: {
          name: "Nome da Empresa",
          plan: "Plano",
          token: "Token",
          submit: "Cadastrar",
          success: "Empresa criada com sucesso!",
        },
      },
      auth: {
        toasts: {
          success: "Login efetuado com sucesso!",
        },
        token: "Token",
      },
      companyModal: {
        form: {
          numberAttendants: "Quantidade de Atendendes",
          numberConections: "Quantidade de Conexões",
        },
        success: "Empresa alterada com sucesso.",
        add: "Empresa adicionada com sucesso.",
      },
      dashboard: {
        tabs: {
          indicators: "Indicadores",
          assessments: "NPS",
          attendants: "Atendentes",
        },

        charts: {
          perDay: {
            title: "Atendimentos hoje: ",
          },
          filters: {
            startDate: "Data Inicial",
            endDate: "Data Final",
            periodText: "Periodo",
            periodOptions: {
              input: "Selecione o período desejado",
              zero: "Nenhum período selecionado",
              three: "Últimos três dias",
              seven: "Últimos sete dias",
              fifteen: "Últimos quinze dias",
              thirty: "Últimos trinta dias",
              sixty: "Últimos sessenta dias",
              ninety: "Últimos noventa dias",
            },
            duedate: "Data de Vencimento",
            filtertype: {
              title: "Tipo de Filtro",
              valueA: "Filtro por Data",
              valueB: "Filtro por Período",
              helperText: "Selecione o período desejado",
            },
          },
        },
        cards: {
          attdPendants: "Atd. Pendentes",
          attdHappening: "Atd. Acontecendo",
          attdPerformed: "Atd. Realizados",
          leads: "Leads",
          mtofService: "T.M. de Atendimento",
          mtofwaiting: "T.M. de Espera",

          inAttendance: "Em Atendimento",
          waiting: "Aguardando",
          activeAttendants: "Atendentes Ativos",
          finalized: "Finalizados",
          newContacts: "Novos Contatos",
          totalReceivedMessages: "Mensagens Recebidas",
          totalSentMessages: "Mensagens Enviadas",
          averageServiceTime: "T.M. de Atendimento",
          averageWaitingTime: "T.M. de Espera",
          status: "Status (Atual)",
        },
        date: {
          initialDate: "Data Inicial",
          finalDate: "Data Final",
        },
        users: {
          name: "Nome",
          numberAppointments: "Quantidade de Atendimentos",
          statusNow: "Atual",
          totalCallsUser: "Total de atendimentos por usuario",
          totalAttendances: "Total de atendimentos",
        },
        licence: {
          available: "Disponível até",
        },
        assessments: {
          totalCalls: "Total de Atendimentos",
          callsWaitRating: "Atendimentos aguardando avaliação",
          callsWithoutRating: "Atendimentos sem avaliação",
          ratedCalls: "Atendimentos avaliados",
          evaluationIndex: "Índice de avaliação",
          score: "Pontuação",
          prosecutors: "Promotores",
          neutral: "Neutros",
          detractors: "Detratores",
        },
        stadis: {
          name: "Nome",
          calif: "Avaliações",
          timemedia: "T.M. de Atendimento",
          statuschat: "Status (Atual)",
        },
      },
      internalChat: {
        deletePrompt: "Esta ação não pode ser revertida, confirmar?",
      },
      connections: {
        title: "Conexões",
        toasts: {
          deleted: "Conexão com o WhatsApp excluída com sucesso!",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteMessage: "Você tem certeza? Essa ação não pode ser revertida.",
          disconnectTitle: "Desconectar",
          disconnectMessage:
            "Tem certeza? Você precisará ler o QR Code novamente.",
        },
        buttons: {
          add: "Adicionar WhatsApp",
          disconnect: "desconectar",
          tryAgain: "Tentar novamente",
          qrcode: "QR CODE",
          newQr: "Novo QR CODE",
          connecting: "Conectando",
          closedImported: "Fechar todos os tickets Importados",
          preparing: "Preparando mensagens para importação",
          importing: "Importando Mensagens do WhatsApp",
          processed: "Processado",
          in: "de",
          support: "Chamar Suporte",
        },
        typography: {
          processed: "Processado",
          in: "de",
          date: "Data da mensagem",
        },
        toolTips: {
          disconnected: {
            title: "Falha ao iniciar sessão do WhatsApp",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e tente novamente, ou solicite um novo QR Code",
          },
          qrcode: {
            title: "Esperando leitura do QR Code",
            content:
              "Clique no botão 'QR CODE' e leia o QR Code com o seu celular para iniciar a sessão",
          },
          connected: {
            title: "Conexão estabelecida!",
          },
          timeout: {
            title: "A conexão com o celular foi perdida",
            content:
              "Certifique-se de que seu celular esteja conectado à internet e o WhatsApp esteja aberto, ou clique no botão 'Desconectar' para obter um novo QR Code",
          },
        },
        table: {
          name: "Nome",
          status: "Status",
          number: "Número",
          lastUpdate: "Última atualização",
          default: "Padrão",
          actions: "Ações",
          session: "Sessão",
        },
      },
      messageHistoryModal: {
        close: "Fechar",
        title: "Histórico de edição da mensagem",
      },

      whatsappModal: {
        title: {
          add: "Adicionar Conexão",
          edit: "Editar Conexão",
        },
        tabs: {
          general: "Geral",
          messages: "Mensagens",
          assessments: "NPS",
          integrations: "Integrações",
          schedules: "Horário de expediente",
        },

        form: {
          geratoken: "Gerar Token",
          importOldMessagesEnable: "Importar mensagens do aparelho",
          importOldMessages: "Data de inicio da importação",
          importRecentMessages: "Data de termino da importação",
          importOldMessagesGroups: "Importar mensagens de grupo",
          closedTicketsPostImported: "Encerrar tickets após importação",
          name: "Nome",
          queueRedirection: "Redirecionamento de Fila",
          queueRedirectionDesc:
            "Selecione uma fila para os contatos que não possuem fila serem redirecionados",
          default: "Padrão",
          group: "Permitir grupos",
          timeSendQueue: "Tempo em minutos para redirecionar para fila",
          importAlert:
            "ATENÇÃO: Ao salvar, sua conexão será encerrada, será necessário ler novamente o QR Code para importar as mensagens",
          timeCreateNewTicket: "Criar novo ticket em x minutos",
          maxUseBotQueues: "Enviar bot x vezes",
          timeUseBotQueues: "Enviar bot em x minutos",
          expiresTicket: "Encerrar chats abertos após x minutos",
          expiresTicketNPS:
            "Encerrar chats aguardando avaliação após x minutos",
          maxUseBotQueuesNPS:
            "Quantidade máxima de vezes que a avaliaçao vai ser enviada",
          closeLastMessageOptions1: "Do atendente/Cliente",
          closeLastMessageOptions2: "Do atendente",
          outOfHoursMessage: "Mensagem de fora de expediente",
          greetingMessage: "Mensagem de saudação",
          complationMessage: "Mensagem de conclusão",
          lgpdLinkPrivacy: "Link para política de privacidade",
          lgpdMessage: "Mensagem de saudaçao LGPD",
          lgpdDeletedMessages: "Ofuscar mensagem apagada pelo contato",
          lgpdSendMessage: "Sempre solicitar confirmação do contato",
          ratingMessage: "Mensagem de avaliaçao - Escala deve ser de 0 a 10",
          token: "Token para integração externa",
          sendIdQueue: "Fila",
          inactiveMessage: "Mensagem de inatividade",
          timeInactiveMessage:
            "Tempo em minutos para envio do aviso de inatividade",
          whenExpiresTicket:
            "Encerrar chats abertos quando última mensagem for",
          expiresInactiveMessage: "Mensagem de encerramento por inatividade",
          prompt: "Prompt",
          collectiveVacationEnd: "Data final",
          collectiveVacationStart: "Data inicial",
          collectiveVacationMessage: "Mensagem de férias coletivas",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        menuItem: {
          enabled: "Habilitado",
          disabled: "Desabilitado",
          minutes: "minutos",
        },
        success: "Conexão salvo com sucesso.",
        errorSendQueue:
          "Foi informado tempo para redirecionar fila, porém não foi selecionada fila para redirecionar. Os dois campos precisam estar preenchidos",
        errorExpiresNPS:
          "É obrigado informar um tempo para avaliação quando se utiliza o NPS.",
        errorRatingMessage:
          "É obrigado informar uma mensagem de avaliação quando se utiliza o NPS.",
      },

      qrCode: {
        message: "Leia o QrCode para iniciar a sessão",
        title: "Utilize o AutoAtende com seu WhatsApp:",
        firstline: "Abra o WhatsApp no seu celular",
        secondline: {
          touch: "Toque em Mais opções no Android",
          orsetting: "ou em Configurações",
          iphone: "no iPhone",
        },
        thirdline:
          "Toque em Dispositivos conectados e, em seguida, em Conectar dispositivos",
        fourthline: "Aponte seu celular para essa tela para capturar o QR Code",
      },
      contacts: {
        title: "Contatos",
        toasts: {
          deleted: "Contato excluído com sucesso!",
          deletedAll: "Todos os contatos form excluídos com sucesso!",
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle: "Deletar ",
          deleteAllTitle: "Deletar Todos",
          importTitlte: "Importar contatos",
          deleteMessage:
            "Tem certeza que deseja deletar este contato? Todos os atendimentos relacionados serão perdidos.",
          deleteAllMessage:
            "Tem certeza que deseja deletar todos os contatos? Todos os tickets relacionados serão perdidos.",
          importMessage: "Deseja importar todos os contatos do telefone?",
        },
        buttons: {
          import: "Importar Contatos",
          importCsv: "Importar CSV",
          importExport: "Importar/Exportar",
          add: "Adicionar Contato",
          delete: "Excluir todos os contatos",
          export: "Exportar contatos",
        },
        table: {
          name: "Nome",
          whatsapp: "WhatsApp",
          email: "Email",
          actions: "Ações",
        },
      },
      queueIntegrationModal: {
        title: {
          add: "Adicionar projeto",
          edit: "Editar projeto",
        },
        form: {
          id: "ID",
          type: "Tipo",
          name: "Nome",
          projectName: "Nome do Projeto",
          language: "Linguagem",
          jsonContent: "JsonContent",
          urlN8N: "URL",
          typebotSlug: "Typebot - Slug",
          typebotExpires: "Tempo em minutos para expirar uma conversa",
          typebotKeywordFinish: "Palavra para finalizar o ticket",
          typebotKeywordRestart: "Palavra para reiniciar o fluxo",
          typebotRestartMessage: "Mensagem ao reiniciar a conversa",
          typebotUnknownMessage: "Mensagem de opção inválida",
          typebotDelayMessage: "Intervalo (ms) entre mensagens",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
          test: "Testar Bot",
        },
        messages: {
          testSuccess: "Integração testada com sucesso!",
          addSuccess: "Integração adicionada com sucesso.",
          editSuccess: "Integração editada com sucesso.",
        },
      },
      promptModal: {
        form: {
          name: "Nome",
          prompt: "Prompt",
          voice: "Voz",
          max_tokens: "Máximo de Tokens na resposta",
          temperature: "Temperatura",
          apikey: "API Key",
          max_messages: "Máximo de mensagens no Histórico",
          voiceKey: "Chave da API de Voz",
          voiceRegion: "Região de Voz",
        },
        success: "Prompt salvo com sucesso!",
        title: {
          add: "Adicionar Prompt",
          edit: "Editar Prompt",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
      },
      prompts: {
        title: "Prompts",
        table: {
          name: "Nome",
          queue: "Setor/Fila",
          max_tokens: "Máximo Tokens Resposta",
          actions: "Ações",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage: "Você tem certeza? Essa ação não pode ser revertida!",
        },
        buttons: {
          add: "Adicionar Prompt",
        },
      },
      contactModal: {
        title: {
          add: "Adicionar contato",
          edit: "Editar contato",
        },
        form: {
          mainInfo: "Dados do contato",
          extraInfo: "Informações adicionais",
          name: "Nome",
          number: "Número do Whatsapp",
          email: "Email",
          extraName: "Nome do campo",
          extraValue: "Valor",
          whatsapp: "Conexão Origem: ",
          disableBot: "Desativar chatbot para este contato",
        },
        buttons: {
          addExtraInfo: "Adicionar informação",
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "Contato salvo com sucesso.",
        error: "Este número não está no WhatsApp.",
        already: "Este número já está salvo nos contatos.",
      },
      queueModal: {
        title: {
          add: "Adicionar fila",
          edit: "Editar fila",
        },
        form: {
          name: "Nome",
          newTicketOnTransfer: "Criar novo ticket ao transferir",
          color: "Cor",
          keywords: "Palavras-chave para transferência",
          greetingMessage: "Mensagem de saudação",
          complationMessage: "Mensagem de conclusão",
          outOfHoursMessage: "Mensagem de fora de expediente",
          ratingMessage: "Mensagem de avaliação",
          token: "Token",
          orderQueue: "Ordem da fila (Bot)",
          integrationId: "Integração",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
          attach: "Anexar Arquivo",
        },
      },
      userModal: {
        title: {
          add: "Adicionar usuário",
          edit: "Editar usuário",
        },
        form: {
          name: "Nome",
          email: "Email",
          password: "Senha",
          profile: "Perfil",
          whatsapp: "Conexão Padrão",
          startWork: "Hora inicial",
          endWork: "Hora final",
          isTricked: "Ver Contatos",
          defaultMenuOpen: "Aberto",
          defaultMenuClosed: "Fechado",
          defaultMenu: "Menu padrão",
          spy: "Espiar conversa",
          allTicket: "Visualizar chamados sem fila",
          enabled: "Habilitado",
          disabled: "Desabilitado",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
          addImage: "Adicionar Imagem",
        },
        tabs: {
          info: "Informações gerais",
          permission: "Permissões",
        },
        success: "Usuário salvo com sucesso.",
      },
      scheduleModal: {
        title: {
          add: "Novo Agendamento",
          edit: "Editar Agendamento",
        },
        form: {
          body: "Mensagem",
          contact: "Contato",
          sendAt: "Data de Agendamento",
          sentAt: "Data de Envio",
        },
        buttons: {
          okAdd: "Adicionar",
          okEdit: "Salvar",
          cancel: "Cancelar",
        },
        success: "Agendamento salvo com sucesso.",
      },

      chat: {
        noTicketMessage: "Selecione um ticket para começar a conversar.",
      },
      uploads: {
        titles: {
          titleUploadMsgDragDrop: "ARRASTE E SOLTE ARQUIVOS NO CAMPO ABAIXO",
          titleFileList: "Lista de arquivo(s)",
        },
      },
      ticketsManager: {
        buttons: {
          newTicket: "Novo",
        },
      },
      ticketsQueueSelect: {
        placeholder: "Filas",
      },
      tickets: {
        inbox: {
          closedAllTickets: "Fechar todos os tickets?",
          closedAll: "Fechar Todos",
          newTicket: "Novo Ticket",
          yes: "SIM",
          no: "NÃO",
          open: "Abertos",
          resolverd: "Resolvidos",
        },
        toasts: {
          deleted: "O atendimento que você estava foi deletado.",
        },
        notification: {
          message: "Mensagem de",
        },
        tabs: {
          open: { title: "Abertas" },
          group: { title: "Grupos" },
          private: { title: "Privados" },
          closed: { title: "Resolvidos" },
          search: { title: "Busca" },
        },
        search: {
          placeholder: "Buscar atendimento e mensagens",
        },
        buttons: {
          showAll: "Todos",
        },
      },
      transferTicketModal: {
        title: "Transferir Ticket",
        fieldLabel: "Digite para buscar usuários",
        comments: "Comentários",
        fieldQueueLabel: "Transferir para fila",
        fieldQueuePlaceholder: "Selecione uma fila",
        noOptions: "Nenhum usuário encontrado com esse nome",
        fieldConnectionSelect: "Selecione uma conexão",
        buttons: {
          ok: "Transferir",
          cancel: "Cancelar",
        },
      },
      ticketsList: {
        pendingHeader: "Aguardando",
        assignedHeader: "Atendendo",
        noTicketsTitle: "Nada aqui!",
        noTicketsMessage:
          "Nenhum atendimento encontrado com esse status ou termo pesquisado",
        buttons: {
          exportAsPdf: "Exportar como PDF",
          accept: "Aceitar",
          closed: "Finalizar",
          reopen: "Reabrir",
        },
      },
      newTicketModal: {
        title: "Criar Ticket",
        fieldLabel: "Digite para pesquisar o contato",
        add: "Adicionar",
        buttons: {
          ok: "Salvar",
          cancel: "Cancelar",
        },
        queue: "Selecione uma fila",
        conn: "Selecione uma conexão",
      },
      ticketdetails: {
        iconspy: "Espiar Conversa",
        iconacept: "Aceitar Conversa",
        iconreturn: "Retornar para Fila",
        iconstatus: "SEM FILA",
      },
      SendContactModal: {
        title: "Enviar contato(s)",
        fieldLabel: "Digite para pesquisar",
        add: "Criar novo contato",
        buttons: {
          cancel: "cancelar",
          ok: "enviar",
        }
      },
      optionsPage: {
        trialExpiration: "Quantos dias de demonstração disponíveis?",
        calif: "Avaliações",
        expedient: "Gerenciamento de Expediente",
        ignore: "Ignorar Grupos?",
        aceptcall: "Chamas de Voz e Vídeo",
        typechatbot: "Tipo Chatbot",
        showTypeBotInMainMenu: "Exibir TypeBot no menu",
        typeBotIframeUrl: "URL do Typebot",
        sendanun: "Enviar saudação ao aceitar o ticket",
        sendagent: "Enviar mensagem de transferencia de Fila/agente",
        createuser: "Habilita a criação de usuários",
        register: "Registrar",
        greeatingOneQueue: "Mensagem com fila única",
        advanced: "CONFIGURAÇÕES AVANÇAS",
        callSuport: "Habilitar Chamar Suporte",
        trialExpiration: "Dias para teste",
        MessageDelete: "Mostrar mensagem apagada pelo cliente",
        displayContactInfo: "Exibir o número do contato ao invés do nome",
        buttons: {
          off: "Desabilitado",
          on: "Habilitado",
          offs: "Desabilitadas",
          ons: "Habilitadas",
          quee: "Fila",
          partner: "Empresa",
          act: "Ativado",
          desact: "Desativado",
          callok: "Enviar mensagem de indisponível",
          calldeny: "Ignorar",
        },
      },
      daysweek: {
        day1: "Segunda-feira",
        day2: "Terça-feira",
        day3: "Quarta-feira",
        day4: "Quinta-feira",
        day5: "Sexta-feira",
        day6: "Sábado",
        day7: "Domingo",
        save: "SALVAR",
      },
      mainDrawer: {
        listTitle: {
          service: "Atendimentos",
          management: "Gerência",
          administration: "Administração",
        },
        listItems: {
          dashboard: "Dashboard",
          export: "Exportar dados",
          connections: "Conexões",
          allConnections: "Todas Conexões",
          tickets: "Atendimentos",
          chatsTempoReal: "Chat Ao Vivo",
          tasks: "Tarefas",
          quickMessages: "Respostas Rápidas",
          contacts: "Contatos",
          queues: "Filas & Chatbot",
          tags: "Tags",
          kanban: "Kanban",
          email: "E-mail",
          users: "Usuários",
          settings: "Configurações",
          helps: "Ajuda",
          messagesAPI: "API",
          internalAPI: "API Interna",
          schedules: "Agendamentos",
          campaigns: {
            menu: "Campanhas",
            listing: "Listagem",
            contactList: "Lista de Contatos",
            config: "Configurações",
          },
          annoucements: "Informativos",
          chats: "Chat Interno",
          financeiro: "Financeiro",
          files: "Lista de arquivos",
          integrations: {
            menu: "Integrações",
          },
          prompts: "Open.Ai",
          queueIntegration: "Integrações",
          typebot: "Typebot",
          companies: "Empresas",
          version: "Versão",
          exit: "Sair",
        },
        appBar: {
          notRegister: "Nenhuma conexão ativa.",
          greetings: {
            one: "Olá ",
            two: "Bem-vindo a ",
            three: "Ativo até",
          },
          user: {
            profile: "Perfil",
            darkmode: "Modo escuro",
            lightmode: "Modo claro",
            language: "Selecionar idioma",
            logout: "Sair",
          },
          i18n: {
            language: "Português",
            language_short: "BR",
          },
        },
      },
      email: {
        subMenus: {
          send: "Enviar E-mail",
          sent: "E-mails enviados",
          schedule: "Agendar envio",
          scheduled: "Envios agendados",
        },
      },
      todo: {
        newtask: "Nova tarefa",
        buttons: {
          add: "Adicionar",
          edit: "Salvar",
        },
      },
      kanban: {
        defaultLane: "Tag padrão",
        inopen: "Em aberto",
        buttons: {
          tags: {
            add: "Nova Tag",
          },
          lanes: {
            viewTicket: "Ver Ticket",
          },
        },
        subMenus: {
          list: "Lanes",
          tags: "Tags",
        },
        defaults: {
          lane: "Default",
        },
      },
      tagsKanban: {
        title: {
          main: "Tags",
          editKanban: "Editar",
        },
        table: {
          name: "Nome",
          tickets: "Tickets",
          actions: "Ações",
        },
        confirmationModal: {
          deleteTitle: "Deseja apagar o Tag?",
          deleteMessage: "A tag será apagadoa do sistema",
        },
      },
      tagModal: {
        success: "Tag salva com sucesso",
        buttons: {
          cancel: "Cancelar",
          okEdit: "Editar",
          okAdd: "Salvar",
        },
        form: {
          name: "Nome",
          color: "Cor",
        },
        title: {
          addKanban: "Adicionar Tag",
          editKanban: "Editar Tag",
          add: "Adicionar Tag",
          edit: "Editar Tag",
        },
      },
      queueIntegration: {
        title: "Integrações",
        table: {
          id: "ID",
          type: "Tipo",
          name: "Nome",
          projectName: "Nome do Projeto",
          language: "Linguagem",
          lastUpdate: "Ultima atualização",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar Projeto",
        },
        searchPlaceholder: "Pesquisar...",
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Você tem certeza? Essa ação não pode ser revertida! e será removida das filas e conexões vinculadas",
        },
      },
      files: {
        title: "Lista de arquivos",
        table: {
          name: "Nome",
          contacts: "Contatos",
          actions: "Ação",
        },
        toasts: {
          deleted: "Lista excluída com sucesso!",
          deletedAll: "Todas as listas foram excluídas com sucesso!",
        },
        buttons: {
          add: "Adicionar",
          deleteAll: "Deletar Todos",
        },
        confirmationModal: {
          deleteTitle: "Deletar",
          deleteAllTitle: "Deletar Todos",
          deleteMessage: "Tem certeza que deseja deletar esta lista?",
          deleteAllMessage: "Tem certeza que deseja deletar todas as listas?",
        },
      },
      messagesAPI: {
        title: "API",
        doc: "Documentação para envio de mensagens:",
        formMethod: "Método de envio:",
        token: "Token cadastrado",
        apiToken: "Token Cadastrado",
        ticketId: "ID do Ticket",
        queueId: "ID da Fila",
        id: "ID da Fatura",
        updateFields: "Dados a serem atualizados",
        updateData: "Dados a serem atualizados",
        queue: "Fila",
        tags: "Tags",
        tagId: "ID da Tag",
        invoiceId: "ID da Fatura",
        companyId: "ID da Empresa",
        body: "Mensagem",
        contactData: "Dados do contato",
        contactId: "ID do Contato",
        file: "Arquivo",
        number: "Número",
        pdfLink: "Link do PDF",
        medias: "Mídias",
        imageLink: "Link de imagem",
        audioLink: "Link de audio",
        textMessage: {
          number: "Número",
          body: "Mensagem",
          token: "Token cadastrado",
        },
        mediaMessage: {
          number: "Número",
          body: "Nome do arquivo",
          media: "Arquivo",
          token: "Token cadastrado",
        },
        buttons: {
          submit: "Enviar",
        },
        helpTexts: {
          textMsg: {
            title: "Mensagem de Texto",
            info:
              "Seguem abaixo a lista de informações necessárias para ",
            endpoint: "Endpoint: ",
            method: "Método: ",
            headers: "Headers: ",
            body: "Body: ",
          },
          test: "Teste de envio: ",
          mediaMsg: {
            title: "Mensagem de Média",
            info:
              "Seguem abaixo a lista de informações necessárias para ",
            endpoint: "Endpoint: ",
            method: "Método: ",
            headers: "Headers: ",
            body: "Body: ",
            formData: "FormData: ",
          },
          instructions: "Instruções",
          notes: {
            title: "Observações importantes",
            textA:
              "Antes de enviar mensagens, é necessário o cadastro do token vinculado à conexão que enviará as mensagens. <br/>Para realizar o cadastro acesse o menu 'Conexões', clique no botão editar da conexão e insira o token no devido campo.",
            textB: {
              title:
                "O número para envio não deve ter mascara ou caracteres especiais e deve ser composto por:",
              partA: "Código de País",
              partB: "DDD",
              partC: "Número",
            },
          },
          info:
          "Seguem abaixo a lista de informações necessárias para ",
        endpoint: "Endpoint: ",
        method: "Método: ",
        headers: "Headers: ",
        body: "Body: ",
        },
      },
      notifications: {
        noTickets: "Nenhuma notificação.",
      },
      quickMessages: {
        title: "Respostas Rápidas",
        searchPlaceholder: "Pesquisar...",
        noAttachment: "Sem anexo",
        confirmationModal: {
          deleteTitle: "Exclusão",
          deleteMessage: "Esta ação é irreversível! Deseja prosseguir?",
        },
        buttons: {
          add: "Adicionar",
          attach: "Anexar Arquivo",
          cancel: "Cancelar",
          edit: "Editar",
        },
        toasts: {
          success: "Atalho adicionado com sucesso!",
          deleted: "Atalho removido com sucesso!",
        },
        dialog: {
          title: "Mensagem Rápida",
          shortcode: "Atalho",
          message: "Resposta",
          save: "Salvar",
          cancel: "Cancelar",
          geral: "Permitir editar",
          add: "Adicionar",
          edit: "Editar",
          visao: "Permitir visão",
        },
        table: {
          shortcode: "Atalho",
          message: "Mensagem",
          actions: "Ações",
          mediaName: "Nome do Arquivo",
          status: "Status",
        },
      },
      messageVariablesPicker: {
        label: "Variavéis disponíveis",
        vars: {
          contactFirstName: "Primeiro Nome",
          contactName: "Nome",
          ticketId: "ID do Ticket",
          user: "Usuário",
          greeting: "Saudação",
          ms: "Milissegundos",
          hour: "Hora",
          date: "Data",
          queue: "Fila",
          connection: "Conexão",
          dataHora: "Data e Hora",
          protocolNumber: "N. Protocolo",
          nameCompany: "Nome da Empresa",
        },
      },
      contactLists: {
        title: "Listas de Contatos",
        table: {
          name: "Nome",
          contacts: "Contatos",
          actions: "Ações",
        },
        buttons: {
          add: "Nova Lista",
        },
        dialog: {
          name: "Nome",
          company: "Empresa",
          okEdit: "Editar",
          okAdd: "Adicionar",
          add: "Adicionar",
          edit: "Editar",
          cancel: "Cancelar",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage: "Esta ação não pode ser revertida.",
        },
        toasts: {
          deleted: "Registro excluído",
        },
      },
      contactListItems: {
        title: "Contatos",
        searchPlaceholder: "Pesquisa",
        buttons: {
          add: "Novo",
          lists: "Listas",
          import: "Importar",
        },
        dialog: {
          name: "Nome",
          number: "Número",
          whatsapp: "Whatsapp",
          email: "E-mail",
          okEdit: "Editar",
          okAdd: "Adicionar",
          add: "Adicionar",
          edit: "Editar",
          cancel: "Cancelar",
        },
        table: {
          name: "Nome",
          number: "Número",
          whatsapp: "Whatsapp",
          email: "E-mail",
          actions: "Ações",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage: "Esta ação não pode ser revertida.",
          importMessage: "Deseja importar os contatos desta planilha? ",
          importTitlte: "Importar",
        },
        toasts: {
          deleted: "Registro excluído",
        },
      },
      campaigns: {
        title: "Campanhas",
        searchPlaceholder: "Pesquisa",
        buttons: {
          add: "Nova Campanha",
          contactLists: "Listas de Contatos",
        },
        table: {
          name: "Nome",
          whatsapp: "Conexão",
          contactList: "Lista de Contatos",
          status: "Status",
          scheduledAt: "Agendamento",
          completedAt: "Concluída",
          confirmation: "Confirmação",
          actions: "Ações",
        },
        dialog: {
          new: "Nova Campanha",
          update: "Editar Campanha",
          readonly: "Apenas Visualização",
          form: {
            name: "Nome",
            message1: "Mensagem 1",
            message2: "Mensagem 2",
            message3: "Mensagem 3",
            message4: "Mensagem 4",
            message5: "Mensagem 5",
            confirmationMessage1: "Mensagem de Confirmação 1",
            confirmationMessage2: "Mensagem de Confirmação 2",
            confirmationMessage3: "Mensagem de Confirmação 3",
            confirmationMessage4: "Mensagem de Confirmação 4",
            confirmationMessage5: "Mensagem de Confirmação 5",
            messagePlaceholder: "Conteúdo da mensagem",
            whatsapp: "Conexão",
            status: "Status",
            scheduledAt: "Agendamento",
            confirmation: "Confirmação",
            contactList: "Lista de Contato",
            tagList: "Lista de Tags",
            fileList: "Lista de Arquivos",
          },
          buttons: {
            add: "Adicionar",
            edit: "Atualizar",
            okadd: "Ok",
            cancel: "Cancelar Disparos",
            restart: "Reiniciar Disparos",
            close: "Fechar",
            attach: "Anexar Arquivo",
          },
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage: "Esta ação não pode ser revertida.",
        },
        toasts: {
          success: "Operação realizada com sucesso",
          cancel: "Campanha cancelada",
          restart: "Campanha reiniciada",
          deleted: "Registro excluído",
        },
      },
      announcements: {
        active: "Ativo",
        inactive: "Inativo",
        title: "Informativos",
        searchPlaceholder: "Pesquisa",
        buttons: {
          add: "Novo Informativo",
          contactLists: "Listas de Informativos",
        },
        table: {
          priority: "Prioridade",
          title: "Title",
          text: "Texto",
          mediaName: "Arquivo",
          status: "Status",
          actions: "Ações",
        },
        dialog: {
          edit: "Edição de Informativo",
          add: "Novo Informativo",
          update: "Editar Informativo",
          readonly: "Apenas Visualização",
          form: {
            priority: "Prioridade",
            title: "Title",
            text: "Texto",
            mediaPath: "Arquivo",
            status: "Status",
          },
          buttons: {
            add: "Adicionar",
            edit: "Atualizar",
            okadd: "Ok",
            cancel: "Cancelar",
            close: "Fechar",
            attach: "Anexar Arquivo",
          },
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage: "Esta ação não pode ser revertida.",
        },
        toasts: {
          success: "Operação realizada com sucesso",
          deleted: "Registro excluído",
        },
      },
      campaignsConfig: {
        title: "Configurações de Campanhas",
      },
      queues: {
        title: "Filas & Chatbot",
        table: {
          name: "Nome",
          color: "Cor",
          greeting: "Mensagem de saudação",
          actions: "Ações",
          orderQueue: "Ordenação da fila (bot)",
        },
        buttons: {
          add: "Adicionar fila",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Você tem certeza? Essa ação não pode ser revertida! Os atendimentos dessa fila continuarão existindo, mas não terão mais nenhuma fila atribuída.",
        },
      },
      queueSelect: {
        inputLabel: "Filas",
      },
      users: {
        title: "Usuários",
        table: {
          id: "Código",
          status: "Status",
          name: "Nome",
          email: "Email",
          profile: "Perfil",
          whatsapp: "Conexão",
          actions: "Ações",
          startWork: "Horário inicial",
          endWork: "Horário final",
        },
        status: {
          online: "Usuários online",
          offline: "Usuários offline",
        },
        buttons: {
          add: "Adicionar usuário",
        },
        toasts: {
          deleted: "Usuário excluído com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Todos os dados do usuário serão perdidos. Os atendimento abertos deste usuário serão movidos para a fila.",
        },
      },
      compaies: {
        title: {
          main: "Empresas",
          add: "Cadastrar empresa",
          edit: "Editar empresa",
        },
        table: {
          id: "ID",
          status: "Ativo",
          name: "Nome",
          email: "Email",
          passwordDefault: "Senha",
          numberAttendants: "Atendentes",
          numberConections: "Conexões",
          value: "Valor",
          namePlan: "Nome Plano",
          numberQueues: "Filas",
          useCampaigns: "Campanhas",
          useExternalApi: "Rest API",
          useFacebook: "Facebook",
          useInstagram: "Instagram",
          useWhatsapp: "Whatsapp",
          useInternalChat: "Chat Interno",
          useSchedules: "Agendamento",
          createdAt: "Criada Em",
          dueDate: "Vencimento",
          lastLogin: "Ult. Login",
          actions: "Ações",
        },
        buttons: {
          add: "Adicionar empresa",
          cancel: "Cancelar alterações",
          okAdd: "Salvar",
          okEdit: "Alterar",
        },
        toasts: {
          deleted: "Empresa excluído com sucesso.",
        },
        confirmationModal: {
          deleteTitle: "Excluir",
          deleteMessage:
            "Todos os dados da empresa serão perdidos. Os tickets abertos deste usuário serão movidos para a fila.",
        },
      },
      helps: {
        title: "Central de Ajuda",
      },
      schedules: {
        title: "Agendamentos",
        confirmationModal: {
          deleteTitle: "Você tem certeza que quer excluir este Agendamento?",
          deleteMessage: "Esta ação não pode ser revertida.",
        },
        table: {
          contact: "Contato",
          body: "Mensagem",
          sendAt: "Data de Agendamento",
          sentAt: "Data de Envio",
          status: "Status",
          actions: "Ações",
        },
        calendar: {
          date: "Data",
          time: "Hora",
          event: "Evento",
          allDay: "Dia Todo",
          week: "Semana",
          work_week: "Agendamentos",
          day: "Dia",
          month: "Mês",
          previous: "Anterior",
          next: "Próximo",
          yesterday: "Ontem",
          tomorrow: "Amanhã",
          today: "Hoje",
          agenda: "Agenda",
          noEventsInRange: "Não há agendamentos no período.",
        },
        buttons: {
          add: "Novo Agendamento",
        },
        toasts: {
          deleted: "Agendamento excluído com sucesso.",
        },
      },
      tags: {
        title: "Tags",
        confirmationModal: {
          deleteTitle: "Você tem certeza que quer excluir esta Tag?",
          deleteMessage: "Esta ação não pode ser revertida.",
          deleteAllTitle: "Confirma a exclusão de todas as tags?",
          deleteAllMessage: "Essa ação não poderá ser revertida",
        },
        table: {
          name: "Nome",
          color: "Cor",
          tickets: "Registros Tagdos",
          actions: "Ações",
        },
        buttons: {
          add: "Nova Tag",
          deleteAll: "Excluir todos as tags",
        },
        toasts: {
          deleted: "Tag excluído com sucesso.",
          deletedAll: "Tags excluídas com sucesso",
        },
      },
      settings: {
        success: "Configurações salvas com sucesso.",
        title: "Configurações",
        settings: {
          userCreation: {
            name: "Criação de usuário",
            options: {
              enabled: "Ativado",
              disabled: "Desativado",
            },
          },
          tabs: {
            options: "Opções",
            schedules: "Horários",
            companies: "Empresas",
            plans: "Planos",
            helps: "Ajuda",
          },
        },
      },
      messagesList: {
        header: {
          assignedTo: "Atribuído à:",
          buttons: {
            return: "Retornar",
            resolve: "Resolver",
            reopen: "Reabrir",
            accept: "Aceitar",
          },
        },
      },
      messagesInput: {
        placeholderOpen: "Digite uma mensagem",
        placeholderClosed:
          "Reabra ou aceite esse ticket para enviar uma mensagem.",
        signMessage: "Assinar",
      },
      message: {
        edited: "Editada",
        deleted: " Mensagem apagada pelo Contato",
      },
      contactDrawer: {
        header: "Dados do contato",
        buttons: {
          edit: "Editar contato",
        },
        extraInfo: "Outras informações",
      },
      fileModal: {
        title: {
          add: "Adicionar lista de arquivos",
          edit: "Editar lista de arquivos",
        },
        buttons: {
          okAdd: "Salvar",
          okEdit: "Editar",
          cancel: "Cancelar",
          fileOptions: "Adicionar arquivo",
        },
        form: {
          name: "Nome da lista de arquivos",
          message: "Detalhes da lista",
          fileOptions: "Lista de arquivos",
          extraName: "Mensagem para enviar com arquivo",
          extraValue: "Valor da opção",
        },
        success: "Lista de arquivos salva com sucesso!",
      },
      ticketOptionsMenu: {
        schedule: "Agendamento",
        delete: "Deletar",
        transfer: "Transferir",
        registerAppointment: "Observações do Contato",
        appointmentsModal: {
          title: "Observações do Contato",
          textarea: "Observação",
          placeholder: "Insira aqui a informação que deseja registrar",
        },
        confirmationModal: {
          title: "Deletar o ticket do contato",
          titleFrom: "Deseja realmente deletar o ticket do contato",
          message:
            "Atenção! Todas as mensagens relacionadas ao ticket serão perdidas.",
        },
        buttons: {
          delete: "Excluir",
          cancel: "Cancelar",
        },
      },
      confirmationModal: {
        buttons: {
          confirm: "Ok",
          cancel: "Cancelar",
        },
      },
      messageOptionsMenu: {
        delete: "Deletar",
        reply: "Responder",
        history: "Histórico",
        edit: "Editar",
        react: "Reagir",
        confirmationModal: {
          title: "Apagar mensagem?",
          message: "Esta ação não pode ser revertida.",
        },
        forward: "Selecione para encaminhar",
        forwardbutton: "ENCAMINHAR",
        forwardmsg1: "Encaminhar mensagem",
        reactions: {
          "like": "Like",
          "love": "Love",
          "haha": "Haha"
        },
        reactionSuccess: "Reaction added successfully!",
      },
      inputErrors: {
        tooShort: "Muito curto",
        tooLong: "Muito longo",
        required: "Obrigatório",
        email: "Endereço de e-mail inválido",
      },
      presence: {
        unavailable: "Indisponível",
        available: "Disponível",
        composing: "Digitando...",
        recording: "Gravando...",
        paused: "Pausado",
      },
      backendErrors: {
        ERR_NO_OTHER_WHATSAPP: "Deve haver pelo menos um WhatsApp padrão.",
        ERR_NO_DEF_WAPP_FOUND:
          "Nenhum WhatsApp padrão encontrado. Verifique a página de conexões.",
        ERR_WAPP_NOT_INITIALIZED:
          "Esta sessão do WhatsApp não foi inicializada. Verifique a página de conexões.",
        ERR_WAPP_CHECK_CONTACT:
          "Não foi possível verificar o contato do WhatsApp. Verifique a página de conexões",
        ERR_WAPP_INVALID_CONTACT: "Este não é um número de Whatsapp válido.",
        ERR_WAPP_DOWNLOAD_MEDIA:
          "Não foi possível baixar mídia do WhatsApp. Verifique a página de conexões.",
        ERR_INVALID_CREDENTIALS:
          "Erro de autenticação. Por favor, tente novamente.",
        ERR_SENDING_WAPP_MSG:
          "Erro ao enviar mensagem do WhatsApp. Verifique a página de conexões.",
        ERR_DELETE_WAPP_MSG: "Não foi possível excluir a mensagem do WhatsApp.",
        ERR_OTHER_OPEN_TICKET: "Já existe um tíquete aberto para este contato.",
        ERR_SESSION_EXPIRED: "Sessão expirada. Por favor entre.",
        ERR_USER_CREATION_DISABLED:
          "A criação do usuário foi desabilitada pelo administrador.",
        ERR_NO_PERMISSION: "Você não tem permissão para acessar este recurso.",
        ERR_DUPLICATED_CONTACT: "Já existe um contato com este número.",
        ERR_NO_SETTING_FOUND: "Nenhuma configuração encontrada com este ID.",
        ERR_NO_CONTACT_FOUND: "Nenhum contato encontrado com este ID.",
        ERR_NO_TICKET_FOUND: "Nenhum tíquete encontrado com este ID.",
        ERR_NO_USER_FOUND: "Nenhum usuário encontrado com este ID.",
        ERR_NO_WAPP_FOUND: "Nenhum WhatsApp encontrado com este ID.",
        ERR_NO_TAG_FOUND: "Nenhuma TAG encontrada",
        ERR_CREATING_MESSAGE: "Erro ao criar mensagem no banco de dados.",
        ERR_CREATING_TICKET: "Erro ao criar tíquete no banco de dados.",
        ERR_FETCH_WAPP_MSG:
          "Erro ao buscar a mensagem no WhtasApp, talvez ela seja muito antiga.",
        ERR_QUEUE_COLOR_ALREADY_EXISTS:
          "Esta cor já está em uso, por favor escolha outra.",
        ERR_WAPP_GREETING_REQUIRED:
          "A mensagem de saudação é obrigatório quando há mais de uma fila.",
        ERR_NO_USER_DELETE: "Não é possível excluir usuário Super",
        ERR_OUT_OF_HOURS: "Fora do Horário de Expediente!",
        ERR_QUICKMESSAGE_INVALID_NAME: "Nome inválido",
        ERR_EDITING_WAPP_MSG: "Não foi possível editar a mensagem do WhatsApp",
      },
    },
  },
};

export { messages };
