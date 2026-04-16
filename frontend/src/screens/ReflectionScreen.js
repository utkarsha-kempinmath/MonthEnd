import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Dimensions, 
    ActivityIndicator, 
    TouchableOpacity,
    Alert 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getReflection } from '../services/homeService';

const screenWidth = Dimensions.get("window").width;

export default function ReflectionScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [trendData, setTrendData] = useState([]);
    const [patterns, setPatterns] = useState([]);

    useEffect(() => {
        fetchReflection();
    }, []);

    const fetchReflection = async () => {
        try {
            const res = await getReflection();
            
            if (res.data.success) {
                // Prepare Chart Data
                const dailyData = res.data.dailyTrend || [];
                // Fallback if array is completely empty to prevent chart crash
                setTrendData(dailyData.length > 0 ? dailyData : [0]);

                // Extract ML Insights
                const mlOut = res.data.mlOutput;
                let extractedPatterns = [];
                
                if (mlOut) {
                    if (mlOut.insights?.tags?.length > 0) {
                        extractedPatterns = mlOut.insights.tags;
                    } else if (mlOut.behavioral?.dominantPattern) {
                        extractedPatterns = [
                            mlOut.behavioral.dominantPattern,
                            mlOut.insights?.summary || "Stable spending phase"
                        ];
                    } else {
                        extractedPatterns = ["Maintaining stable routine", "No severe anomalies"];
                    }
                } else {
                    extractedPatterns = ["Analyzing your recent behavior..."];
                }
                
                setPatterns(extractedPatterns);
            }
        } catch (err) {
            console.log("Reflection Fetch Error:", err);
            Alert.alert("Error", "Could not load your monthly reflection.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.softTeal || COLORS.accentOrange} />
            </View>
        );
    }

    // Generate labels for the X-axis (e.g., every 4th day)
    const chartLabels = trendData.map((_, i) => (i % 4 === 0 || i === 0 ? String(i + 1) : ""));

    return (
        <View style={styles.container}>
            {/* Custom Banner Header */}
            <View style={styles.bannerHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Month Track</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                <View style={styles.chartWrapper}>
                    <Text style={styles.chartTitle}>Spending variability this month</Text>
                    <LineChart
                        data={{
                            labels: chartLabels,
                            datasets: [{ data: trendData }]
                        }}
                        width={screenWidth - 40}
                        height={220}
                        withVerticalLines={false}
                        withHorizontalLines={true}
                        chartConfig={{
                            backgroundColor: COLORS.background,
                            backgroundGradientFrom: COLORS.background,
                            backgroundGradientTo: COLORS.background,
                            decimalPlaces: 0,
                            color: (opacity = 1) => COLORS.accentOrange, // Red/Orange line
                            labelColor: (opacity = 1) => '#888',
                            style: { borderRadius: 16 },
                            propsForDots: { r: "3", strokeWidth: "2", stroke: COLORS.accentOrange },
                            propsForBackgroundLines: { strokeDasharray: "", stroke: "rgba(0,0,0,0.05)" }
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>

                <View style={styles.patternsSection}>
                    <Text style={styles.sectionTitle}>Key Patterns</Text>
                    
                    {patterns.map((item, index) => (
                        <View key={index} style={styles.patternPill}>
                            <Text style={styles.patternText}>{item}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footerSection}>
                    <Text style={styles.quoteText}>Patterns don't judge. They inform</Text>
                    
                    <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Home")}>
                        <Text style={styles.actionButtonText}>Start Over</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#FDECE4' // Light peach to match screenshot
    },
    bannerHeader: {
        backgroundColor: '#8ABEB7', // Soft Teal from the screenshot
        paddingTop: 60,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    chartWrapper: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    chartTitle: {
        alignSelf: 'flex-start',
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        fontWeight: '600'
    },
    chart: {
        borderRadius: 16,
        paddingRight: 20, // prevents rightmost label from cutting off
    },
    patternsSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    patternPill: {
        backgroundColor: '#8ABEB7', // Soft Teal
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    patternText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    footerSection: {
        alignItems: 'center',
        marginTop: 20,
    },
    quoteText: {
        color: '#B03A2E', // Deep Red/Orange
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    actionButton: {
        backgroundColor: '#8ABEB7',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});