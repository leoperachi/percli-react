# IconButton Component

Um componente de botão circular com ícone personalizável, suportando diferentes tipos de ação e múltiplas bibliotecas de ícones.

## Principais Características

- ✅ **Múltiplas bibliotecas de ícones**: MaterialIcons, FontAwesome, Ionicons, etc.
- ✅ **Tipos de botão**: submit, redirect, button
- ✅ **Personalização completa**: cor de fundo, tamanho, cor do ícone
- ✅ **Estado desabilitado** com feedback visual
- ✅ **Sombra e elevação** para Android/iOS
- ✅ **Integração com tema** do app

## Uso Básico

```tsx
import { IconButton } from '../components/IconButton';

// Botão básico
<IconButton
  iconName="add"
  onPress={() => console.log('Pressionado!')}
/>

// Botão de submit
<IconButton
  iconName="check"
  type="submit"
  onSubmit={() => handleFormSubmit()}
  backgroundColor="#4CAF50"
/>

// Botão de redirecionamento
<IconButton
  iconName="arrow-forward"
  type="redirect"
  onRedirect={() => navigation.navigate('NextScreen')}
  backgroundColor="#2196F3"
/>
```

## Props

### Obrigatórias
| Prop | Tipo | Descrição |
|------|------|-----------|
| `iconName` | `string` | Nome do ícone a ser exibido |

### Opcionais
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `iconLibrary` | `IconLibrary` | `'MaterialIcons'` | Biblioteca de ícones a usar |
| `iconSize` | `number` | `size * 0.5` | Tamanho do ícone em pixels |
| `iconColor` | `string` | `'#FFFFFF'` | Cor do ícone |
| `backgroundColor` | `string` | `theme.colors.primary` | Cor de fundo do botão |
| `size` | `number` | `48` | Tamanho total do botão em pixels |
| `type` | `'submit' \| 'redirect' \| 'button'` | `'button'` | Tipo de ação do botão |
| `disabled` | `boolean` | `false` | Se o botão está desabilitado |
| `style` | `ViewStyle` | - | Estilos adicionais |

### Callbacks
| Prop | Tipo | Quando usar |
|------|------|-------------|
| `onPress` | `(event) => void` | Para `type="button"` |
| `onSubmit` | `() => void` | Para `type="submit"` |
| `onRedirect` | `() => void` | Para `type="redirect"` |

## Bibliotecas de Ícones Suportadas

- `MaterialIcons` (padrão)
- `MaterialCommunityIcons`
- `FontAwesome`
- `FontAwesome5`
- `Ionicons`
- `Feather`
- `AntDesign`
- `Entypo`

## Exemplos de Uso

### Botões de Formulário
```tsx
// Botão de enviar
<IconButton
  iconName="send"
  iconLibrary="MaterialIcons"
  type="submit"
  onSubmit={handleSubmit}
  backgroundColor="#4CAF50"
  size={56}
/>

// Botão de cancelar
<IconButton
  iconName="close"
  iconLibrary="MaterialIcons"
  type="button"
  onPress={handleCancel}
  backgroundColor="#F44336"
  size={56}
/>
```

### Botões de Navegação
```tsx
// Voltar
<IconButton
  iconName="arrow-back"
  type="redirect"
  onRedirect={() => navigation.goBack()}
  backgroundColor="#2196F3"
  size={40}
/>

// Avançar
<IconButton
  iconName="arrow-forward"
  type="redirect"
  onRedirect={() => navigation.navigate('Next')}
  backgroundColor="#2196F3"
  size={40}
/>
```

### Botões de Ação
```tsx
// Favoritar
<IconButton
  iconName="favorite"
  iconLibrary="MaterialIcons"
  onPress={toggleFavorite}
  backgroundColor={isFavorite ? "#E91E63" : "#CCCCCC"}
  size={48}
/>

// Compartilhar
<IconButton
  iconName="share"
  iconLibrary="Ionicons"
  onPress={handleShare}
  backgroundColor="#9C27B0"
  size={48}
/>

// Configurações
<IconButton
  iconName="settings"
  iconLibrary="Feather"
  onPress={openSettings}
  backgroundColor="#607D8B"
  size={48}
/>
```

### Estados Especiais
```tsx
// Botão desabilitado
<IconButton
  iconName="block"
  onPress={handleAction}
  disabled={true}
  size={48}
/>

// Botão pequeno para listas
<IconButton
  iconName="more-vert"
  onPress={openMenu}
  backgroundColor="#757575"
  size={32}
/>

// Botão grande para ações principais
<IconButton
  iconName="add"
  onPress={addItem}
  backgroundColor="#4CAF50"
  size={64}
/>
```

## Integração com Tema

O componente se integra automaticamente com o ThemeContext:

```tsx
// Cores padrão baseadas no tema
const button = (
  <IconButton
    iconName="home"
    // backgroundColor será theme.colors.primary automaticamente
    // iconColor será '#FFFFFF' automaticamente
  />
);

// Personalizando cores
const customButton = (
  <IconButton
    iconName="heart"
    backgroundColor="#E91E63" // Sobrescreve o tema
    iconColor="#FFFFFF"
  />
);
```

## Acessibilidade

O componente herda todas as props de acessibilidade do TouchableOpacity:

```tsx
<IconButton
  iconName="delete"
  onPress={handleDelete}
  accessibilityLabel="Excluir item"
  accessibilityHint="Toque duas vezes para excluir este item"
/>
```