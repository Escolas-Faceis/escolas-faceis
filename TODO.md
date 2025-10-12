- [x] Edit app/views/partials/filtro-atualizado-new.ejs to add close filter panel on outside click and on form submit.
- [x] Test the filter toggle functionality.


    <section id="filtro">
    <h4 id="filtros"  name="filtros">Filtros</h4>

<section class="filter-schools" id="panel">
    <form id="filter-form" method="GET" action="/encontre-escolas">

    <section id="escolaridade" class="sec">
        <h4 id="niveis-de-ensino"> Níveis de Ensino</h4>
        <ul>
        <li><input type="checkbox" name="niveis" id="edu-inf" value="Educação Infantil" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Educação Infantil') ? 'checked' : '' %>><label for="edu-inf">Educação Infantil</label></li>
        <li><input type="checkbox" name="niveis" id="fund1" value="Ensino Fundamental I" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Ensino Fundamental I') ? 'checked' : '' %>><label for="fund1">Ensino Fundamental I</label></li>
        <li><input type="checkbox" name="niveis" id="fund2" value="Ensino Fundamental II" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Ensino Fundamental II') ? 'checked' : '' %>><label for="fund2">Ensino Fundamental II</label></li>
        <li><input type="checkbox" name="niveis" id="e-med" value="Ensino Médio" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Ensino Médio') ? 'checked' : '' %>><label for="e-med">Ensino Médio</label></li>
        <li><input type="checkbox" name="niveis" id="e-int" value="Educação Integrada" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Educação Integrada') ? 'checked' : '' %>><label for="e-int">Ensino Integrado</label></li>
        <li><input type="checkbox" name="niveis" id="e-tec" value="Cursos Técnicos" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Cursos Técnicos') ? 'checked' : '' %>><label for="e-tec">Cursos Técnicos</label></li>
        <li><input type="checkbox" name="niveis" id="cursos" value="Cursos Extracurriculares" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.niveis && searchParams.niveis.includes('Cursos Extracurriculares') ? 'checked' : '' %>><label for="cursos">Cursos Extracurriculares</label></li>
        </ul>
        </section>

    <section id="rede" class="sec">
        <h4 id="rede-escolar"> Rede</h4>
        <ul>
        <li><input type="checkbox" name="redes" id="municipal" value="Municipal" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.redes && searchParams.redes.includes('Municipal') ? 'checked' : '' %>><label for="municipal">Municipal</label></li>
        <li><input type="checkbox" name="redes" id="estadual" value="Estadual" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.redes && searchParams.redes.includes('Estadual') ? 'checked' : '' %>><label for="estadual">Estadual</label></li>
        <li><input type="checkbox" name="redes" id="fundacao" value="Fundação/Instituto" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.redes && searchParams.redes.includes('Fundação/Instituto') ? 'checked' : '' %>><label for="fundacao">Fundação/Instituto</label></li>
        <li><input type="checkbox" name="redes" id="privada" value="Privada" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.redes && searchParams.redes.includes('Privada') ? 'checked' : '' %>><label for="privada">Privada</label></li>
            <ul>


                <section class="range-slider"><h4 id="mens">Mensalidade</h6>
                    <span class="range-input">

                        <section class="range-price">
                            <label for="min">Min</label>
                            <input type="number" name="min" value="300"> <br>
                            <label for="max">Max</label>
                            <input type="number" name="max" value="700">
                          </section>


                    <input type="checkbox" name="bes" id="bes"><label for="bes">Bolsa de Estudos</label>
                </section>

            </ul>
        </ul>
    </section>

    <section id="periodo" class="sec">
        <h4 id="turno"> Turno</h4>
        <ul>
        <li><input type="checkbox" name="turnos" id="manha" value="Manhã" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.turnos && searchParams.turnos.includes('Manhã') ? 'checked' : '' %>><label for="manha">Manhã</label></li>
        <li><input type="checkbox" name="turnos" id="tarde" value="Tarde" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.turnos && searchParams.turnos.includes('Tarde') ? 'checked' : '' %>><label for="tarde">Tarde</label></li>
        <li><input type="checkbox" name="turnos" id="integral" value="Integral" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.turnos && searchParams.turnos.includes('Integral') ? 'checked' : '' %>><label for="integral">Integral</label></li>
        <li><input type="checkbox" name="turnos" id="noite" value="Noturno" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.turnos && searchParams.turnos.includes('Noturno') ? 'checked' : '' %>><label for="noite">Noturno</label></li>
        </ul>
    </section>

    <section id="outro" class="sec">
        <h4 id="outros">Outros</h4>
        <ul>
        <li><input type="checkbox" name="acessibilidade" id="ace" value="true" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.acessibilidade === 'true' ? 'checked' : '' %>><label for="ace">Acessibilidade</label></li>
        <li><input type="checkbox" name="eja" id="eja" value="true" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.eja === 'true' ? 'checked' : '' %>><label for="eja">EJA</label></li>
        <li><input type="checkbox" name="bilingue" id="bilingue" value="true" <%= typeof searchParams !== 'undefined' && searchParams && searchParams.bilingue === 'true' ? 'checked' : '' %>><label for="bilingue">Escola Bilingue</label></li>
        </ul>
    </section>

    <p><button type="submit" id="filtrar"> Filtrar </button></p>
    </form>
</section></section>