var pool = require("../../config/pool_conexoes");

const axios = require("axios");

const filtroModel = {
    findAllSorted: async () => {
        try {
            const [linhas] = await pool.query(`
                SELECT e.*, u.nome_usuario, u.email_usuario,
                       COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                       REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta,
                       CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END AS is_premium
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                LEFT JOIN assinatura ass ON e.id_escola = ass.id_escola AND ass.ativo = TRUE AND (ass.data_fim IS NULL OR ass.data_fim >= CURDATE())
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
                GROUP BY e.id_escola, u.id_usuario
                ORDER BY CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END DESC, media_avaliacao DESC, e.nome_escola ASC
            `);
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    findPage: async (pagina, total) => {
        try {
            const [linhas] = await pool.query(`
                SELECT e.*, u.nome_usuario, u.email_usuario,
                       COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                       REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta,
                       CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END AS is_premium
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                LEFT JOIN assinatura ass ON e.id_escola = ass.id_escola AND ass.ativo = TRUE AND (ass.data_fim IS NULL OR ass.data_fim >= CURDATE())
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
                GROUP BY e.id_escola, u.id_usuario
                ORDER BY CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END DESC, media_avaliacao DESC, e.nome_escola ASC
                LIMIT ?, ?
            `, [pagina, total]);
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    totalReg: async () => {
        try {
            const [linhas] = await pool.query(
                "SELECT count(*) total FROM escolas"
            )
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    searchAndFilterSchools: async (params = {}, pagina = 0, total = 5) => {
        try {
            let whereConditions = [];
            let queryParams = [];

            let query = `
                SELECT e.*, u.nome_usuario, u.email_usuario,
                       COALESCE(AVG(a.nota), 0) AS media_avaliacao,
                       REPLACE(i.caminho_imagem, 'app/public', '') AS img_perfil_pasta,
                       CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END AS is_premium
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                LEFT JOIN avaliacoes a ON e.id_escola = a.id_escola
                LEFT JOIN imagens i ON e.img_perfil_id = i.id_imagem
                LEFT JOIN assinatura ass ON e.id_escola = ass.id_escola AND ass.ativo = TRUE AND (ass.data_fim IS NULL OR ass.data_fim >= CURDATE())
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
            `;

            if (params.nome && params.nome.trim()) {
                whereConditions.push("e.nome_escola LIKE ?");
                queryParams.push(`%${params.nome.trim()}%`);
            }

            if (params.niveis && Array.isArray(params.niveis) && params.niveis.length > 0) {
                const nivelConditions = params.niveis.map(nivel => "e.tipo_ensino LIKE ?");
                whereConditions.push(`(${nivelConditions.join(' OR ')})`);
                params.niveis.forEach(nivel => queryParams.push(`%${nivel}%`));
            }

            if (params.redes && Array.isArray(params.redes) && params.redes.length > 0) {
                const redeConditions = params.redes.map(rede => "e.rede LIKE ?");
                whereConditions.push(`(${redeConditions.join(' OR ')})`);
                params.redes.forEach(rede => queryParams.push(`%${rede}%`));
            }

            if (params.turnos && Array.isArray(params.turnos) && params.turnos.length > 0) {
                const turnoConditions = params.turnos.map(turno => "e.turnos LIKE ?");
                whereConditions.push(`(${turnoConditions.join(' OR ')})`);
                params.turnos.forEach(turno => queryParams.push(`%${turno}%`));
            }

            if (params.acessibilidade && Array.isArray(params.acessibilidade) && params.acessibilidade.length > 0) {
                const acessConditions = params.acessibilidade.map(acess => "e.acessibilidade LIKE ?");
                whereConditions.push(`(${acessConditions.join(' OR ')})`);
                params.acessibilidade.forEach(acess => queryParams.push(`%${acess}%`));
            }

            if (whereConditions.length > 0) {
                query += " AND " + whereConditions.join(" AND ");
            }

            query += `
                GROUP BY e.id_escola, u.id_usuario
                ORDER BY CASE WHEN ass.id_assinatura IS NOT NULL THEN 1 ELSE 0 END DESC, media_avaliacao DESC, e.nome_escola ASC
            `;

            let [linhas] = await pool.query(query, queryParams);

            if (params.cidade && params.cidade.trim()) {
                linhas = await filtroModel.filterByCidade(linhas, params.cidade.trim());
            }

            if (params.regiao && params.regiao !== 'regiao') {
                linhas = await filtroModel.filterByRegiao(linhas, params.regiao);
            }

            linhas = linhas.slice(pagina, pagina + total);

            return linhas;
        } catch (error) {
            console.log("Error in searchAndFilterSchools:", error);
            return error;
        }
    },

    countFilteredSchools: async (params = {}) => {
        try {
            let whereConditions = [];
            let queryParams = [];

            let query = `
                SELECT e.id_escola, e.cep
                FROM escolas e
                JOIN usuarios u ON e.id_usuario = u.id_usuario
                WHERE u.status_usuario = 1 AND u.tipo_usuario = "E"
            `;

            if (params.nome && params.nome.trim()) {
                whereConditions.push("e.nome_escola LIKE ?");
                queryParams.push(`%${params.nome.trim()}%`);
            }

            if (params.niveis && Array.isArray(params.niveis) && params.niveis.length > 0) {
                const nivelConditions = params.niveis.map(nivel => "e.tipo_ensino LIKE ?");
                whereConditions.push(`(${nivelConditions.join(' OR ')})`);
                params.niveis.forEach(nivel => queryParams.push(`%${nivel}%`));
            }

            if (params.redes && Array.isArray(params.redes) && params.redes.length > 0) {
                const redeConditions = params.redes.map(rede => "e.rede LIKE ?");
                whereConditions.push(`(${redeConditions.join(' OR ')})`);
                params.redes.forEach(rede => queryParams.push(`%${rede}%`));
            }

            if (params.turnos && Array.isArray(params.turnos) && params.turnos.length > 0) {
                const turnoConditions = params.turnos.map(turno => "e.turnos LIKE ?");
                whereConditions.push(`(${turnoConditions.join(' OR ')})`);
                params.turnos.forEach(turno => queryParams.push(`%${turno}%`));
            }

            if (params.acessibilidade && Array.isArray(params.acessibilidade) && params.acessibilidade.length > 0) {
                const acessConditions = params.acessibilidade.map(acess => "e.acessibilidade LIKE ?");
                whereConditions.push(`(${acessConditions.join(' OR ')})`);
                params.acessibilidade.forEach(acess => queryParams.push(`%${acess}%`));
            }

            if (whereConditions.length > 0) {
                query += " AND " + whereConditions.join(" AND ");
            }

            let [linhas] = await pool.query(query, queryParams);

            if (params.cidade && params.cidade.trim()) {
                linhas = await filtroModel.filterByCidade(linhas, params.cidade.trim());
            }

            if (params.regiao && params.regiao !== 'regiao') {
                linhas = await filtroModel.filterByRegiao(linhas, params.regiao);
            }

            return [{ total: linhas.length }];
        } catch (error) {
            console.log("Error in countFilteredSchools:", error);
            return error;
        }
    },

    filterByCidade: async (schools, cidade) => {
        const filteredSchools = [];
        for (const school of schools) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${school.cep.replace(/\D/g, '')}/json/`);
                const data = response.data;
                if (!data.erro && data.localidade && data.localidade.toLowerCase().includes(cidade.toLowerCase())) {
                    filteredSchools.push(school);
                }
            } catch (error) {
                console.log(`Erro ao consultar CEP ${school.cep}:`, error.message);
            }
        }
        return filteredSchools;
    },

    filterByRegiao: async (schools, regiao) => {
        const regioes = {
            'RNO': ['AM', 'RR', 'AP', 'PA', 'TO', 'RO', 'AC'],
            'RND': ['MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'],
            'RCE': ['MT', 'MS', 'GO', 'DF'],
            'RSD': ['MG', 'ES', 'RJ', 'SP'],
            'RSU': ['PR', 'SC', 'RS']
        };

        const estados = regioes[regiao] || [];
        const filteredSchools = [];

        for (const school of schools) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${school.cep.replace(/\D/g, '')}/json/`);
                const data = response.data;
                if (!data.erro && data.uf && estados.includes(data.uf)) {
                    filteredSchools.push(school);
                }
            } catch (error) {
                console.log(`Erro ao consultar CEP ${school.cep}:`, error.message);
            }
        }
        return filteredSchools;
    }
};

module.exports = filtroModel;
