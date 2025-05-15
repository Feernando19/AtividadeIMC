import { StyleSheet, Text, View, SafeAreaView, Button, ScrollView, StatusBar, TextInput, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons/faHeartbeat';
import { useState } from 'react';

function Topo({ titulo }) {
  return (
    <View style={estilos.topo}>
      <Text style={estilos.titulo}>{titulo}</Text>
    </View>
  );
}

function CampoNumerico({ rotulo, placeholder, valor, aoModificar }) {
  const tratarEntrada = (texto) => {
    let filtrado = texto.replace(/[^0-9.,]/g, '');
    const partesVirgula = filtrado.split(',');
    if (partesVirgula.length > 2) filtrado = partesVirgula[0] + ',' + partesVirgula.slice(1).join('');
    const partesPonto = filtrado.split('.');
    if (partesPonto.length > 2) filtrado = partesPonto[0] + '.' + partesPonto.slice(1).join('');
    aoModificar(filtrado);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#FFFFFF', marginBottom: 4 }}>{rotulo}</Text>
      <TextInput
        style={estilos.entrada}
        placeholder={placeholder}
        placeholderTextColor="#BBBBBB"
        value={valor}
        onChangeText={tratarEntrada}
        keyboardType="numeric"
      />
    </View>
  );
}

export default function App() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState('');
  const [faixa, setFaixa] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const limparCampos = () => {
    setPeso('');
    setAltura('');
    setImc('');
    setFaixa('');
    setMostrarResultado(false);
  };

  const validarCampo = (valor, nomeCampo) => {
    const numero = parseFloat(valor.replaceAll('.', '').replaceAll(',', '.'));
    if (!valor || isNaN(numero) || numero <= 0) {
      Alert.alert("Erro", `Por favor, insira um valor válido e positivo para ${nomeCampo}.`);
      return false;
    }
    return true;
  };

  const calcularIMC = () => {
    const pesoValido = validarCampo(peso, 'peso');
    const alturaValida = validarCampo(altura, 'altura');

    if (!pesoValido || !alturaValida) {
      setMostrarResultado(false);
      return;
    }

    const pesoNumero = parseFloat(peso.replaceAll('.', '').replaceAll(',', '.'));
    const alturaNumero = parseFloat(altura.replaceAll('.', '').replaceAll(',', '.'));

    const resultado = pesoNumero / Math.pow(alturaNumero, 2);

    if (isNaN(resultado)) {
      setMostrarResultado(false);
      return;
    }

    setImc(resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

    if (resultado < 18.5) setFaixa('Abaixo do peso (menor que 18,5)');
    else if (resultado < 25) setFaixa('Peso normal (18,5 a 24,9)');
    else if (resultado < 30) setFaixa('Sobrepeso (25 a 29,9)');
    else if (resultado < 35) setFaixa('Obesidade grau I (30 a 34,9)');
    else if (resultado < 40) setFaixa('Obesidade grau II (35 a 39,9)');
    else setFaixa('Obesidade grau III (40 ou mais)');

    setMostrarResultado(true);
  };

  return (
    <SafeAreaView style={estilos.tela}>
      <Topo titulo="Minha calculadora - IMC" />
      <ScrollView style={estilos.scroll}>
        <View style={estilos.blocoFormulario}>
          <FontAwesomeIcon style={estilos.icone} icon={faHeartbeat} size={60} />
          <CampoNumerico
            rotulo="Peso (Kg)*"
            placeholder="Ex: 70,5"
            valor={peso}
            aoModificar={setPeso}
          />
          <CampoNumerico
            rotulo="Altura (m)*"
            placeholder="Ex: 1,75"
            valor={altura}
            aoModificar={setAltura}
          />
          <View style={estilos.botoes}>
            <Button title="CALCULAR" onPress={calcularIMC} color="#FFA500" />
            <View style={{ height: 8 }} />
            <Button title="LIMPAR" onPress={limparCampos} color="#FF6347" />
          </View>
        </View>

        {mostrarResultado && (
          <View style={estilos.resultadoBox}>
            <Text style={estilos.tituloResultado}>Resultado</Text>
            <Text style={estilos.textoResultado}>IMC: <Text style={estilos.destaque}>{imc}</Text></Text>
            <Text style={estilos.textoResultado}>Classificação: <Text style={estilos.destaque}>{faixa}</Text></Text>

            <Text style={estilos.tituloResultado}>Tabela de Classificação</Text>
            <View style={estilos.tabela}>
              {[
                ['< 18,5', 'Abaixo do peso'],
                ['18,5 - 24,9', 'Peso normal'],
                ['25 - 29,9', 'Sobrepeso'],
                ['30 - 34,9', 'Obesidade grau I'],
                ['35 - 39,9', 'Obesidade grau II'],
                ['40 ou mais', 'Obesidade grau III']
              ].map(([limite, descricao], i) => (
                <View key={i} style={estilos.linha}>
                  <Text style={estilos.colunaLimite}>{limite}</Text>
                  <Text style={estilos.colunaTexto}>{descricao}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#121D33',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 16,
  },
  scroll: {
    flexGrow: 1,
  },
  topo: {
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  blocoFormulario: {
    backgroundColor: '#1A273E',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  icone: {
    alignSelf: 'center',
    color: '#FFA500',
    marginBottom: 16,
  },
  entrada: {
    backgroundColor: '#2C3E50',
    borderRadius: 6,
    padding: 10,
    color: '#FFFFFF',
  },
  botoes: {
    marginTop: 10,
  },
  resultadoBox: {
    backgroundColor: '#1B2A49',
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
  },
  tituloResultado: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  textoResultado: {
    color: '#DDDDDD',
    fontSize: 16,
    marginBottom: 6,
  },
  destaque: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  tabela: {
    marginTop: 10,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  colunaLimite: {
    color: '#FFDD00',
    fontWeight: 'bold',
    flex: 1,
  },
  colunaTexto: {
    color: '#FFFFFF',
    flex: 2,
  },
});
