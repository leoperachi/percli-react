import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainLayout } from '../components/MainLayout';
import { useTheme } from '../contexts/ThemeContext';
import { logger } from '../services/loggerService';
import { LogAnalyzer } from '../services/logAnalyzer';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any;
}

export const LogViewerScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, activeFilter]);

  const loadLogs = async () => {
    console.log('[LogViewerScreen] Carregando logs...');
    const loadedLogs = await logger.getLogs();
    console.log('[LogViewerScreen] Logs carregados:', loadedLogs.length);
    setLogs(loadedLogs);
  };

  const filterLogs = () => {
    if (activeFilter === 'all') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(log => log.level === activeFilter));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLogs();
    setRefreshing(false);
  };

  const handleClearLogs = () => {
    Alert.alert('Limpar Logs', 'Tem certeza que deseja limpar todos os logs?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('[LogViewerScreen] Limpando logs...');

            // Limpa os logs
            await logger.clearLogs();
            console.log('[LogViewerScreen] Logs limpos, recarregando...');

            // Limpa o estado local imediatamente
            setLogs([]);
            setFilteredLogs([]);

            // Recarrega do storage (deve estar vazio agora)
            await loadLogs();
            console.log('[LogViewerScreen] Logs recarregados após limpar');

            // Mostra confirmação
            Alert.alert('Sucesso', 'Logs limpos com sucesso!');
          } catch (error) {
            console.error('[LogViewerScreen] Erro ao limpar logs:', error);
            Alert.alert('Erro', 'Falha ao limpar logs. Tente novamente.');
          }
        },
      },
    ]);
  };

  const handleExportLogs = async () => {
    try {
      const logsText = await logger.exportLogs();
      await Share.share({
        message: logsText,
        title: 'PerCLI Logs',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar logs');
    }
  };

  const handleExportProblems = async () => {
    try {
      const summary = await LogAnalyzer.getSummary();
      const problems = await LogAnalyzer.exportProblems();
      const grouped = await LogAnalyzer.exportGroupedErrors();

      const fullReport = `${summary}\n\n${problems}\n\n${grouped}`;

      await Share.share({
        message: fullReport,
        title: 'PerCLI - Relatório de Problemas',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao exportar problemas');
    }
  };

  const handleShowSummary = async () => {
    try {
      const summary = await LogAnalyzer.getSummary();
      Alert.alert('Resumo dos Logs', summary, [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao gerar resumo');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error':
        return '#f44336';
      case 'warn':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'debug':
        return '#9c27b0';
      default:
        return '#666';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <MainLayout title="Logs do App" leftIcon="back" onLeftPress={handleBackPress}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header com filtros */}
        <View style={[styles.header, {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border
        }]}>
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.colors.background },
                  activeFilter === 'all' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setActiveFilter('all')}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.colors.text },
                    activeFilter === 'all' && styles.filterTextActive,
                  ]}
                >
                  Todos ({logs.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.colors.background },
                  activeFilter === 'error' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setActiveFilter('error')}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.colors.text },
                    activeFilter === 'error' && styles.filterTextActive,
                  ]}
                >
                  Erros ({logs.filter(l => l.level === 'error').length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.colors.background },
                  activeFilter === 'warn' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setActiveFilter('warn')}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.colors.text },
                    activeFilter === 'warn' && styles.filterTextActive,
                  ]}
                >
                  Avisos ({logs.filter(l => l.level === 'warn').length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.colors.background },
                  activeFilter === 'info' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setActiveFilter('info')}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: theme.colors.text },
                    activeFilter === 'info' && styles.filterTextActive,
                  ]}
                >
                  Info ({logs.filter(l => l.level === 'info').length})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Lista de logs */}
        <ScrollView
          style={styles.logsContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          {filteredLogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Nenhum log encontrado
              </Text>
            </View>
          ) : (
            filteredLogs.map((log, index) => (
              <View key={index} style={[
                styles.logEntry,
                {
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: getLogColor(log.level)
                }
              ]}>
                <View style={styles.logHeader}>
                  <View
                    style={[
                      styles.logLevelBadge,
                      { backgroundColor: getLogColor(log.level) },
                    ]}
                  >
                    <Text style={styles.logLevelText}>
                      {log.level.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.logTimestamp, { color: theme.colors.textSecondary }]}>
                    {formatTimestamp(log.timestamp)}
                  </Text>
                </View>
                <Text style={[styles.logMessage, { color: theme.colors.text }]}>
                  {log.message}
                </Text>
                {log.data && (
                  <Text style={[
                    styles.logData,
                    {
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background
                    }
                  ]}>
                    {JSON.stringify(log.data, null, 2)}
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <View style={[
          styles.footer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border
          }
        ]}>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClearLogs}
          >
            <Text style={styles.actionButtonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton]}
            onPress={handleExportLogs}
          >
            <Text style={styles.actionButtonText}>Exportar Todos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  logEntry: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  logLevelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  logTimestamp: {
    fontSize: 12,
  },
  logMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  logData: {
    fontSize: 12,
    fontFamily: 'monospace',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  exportButton: {
    backgroundColor: '#4caf50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
