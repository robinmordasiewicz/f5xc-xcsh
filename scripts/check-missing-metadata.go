// Check missing metadata in upstream API specifications
// This script validates that upstream specs include all metadata needed by xcsh
// and creates GitHub issues for any gaps found
package main

import (
	"encoding/json"
	"flag"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

// SpecIndex represents the upstream spec index
type SpecIndex struct {
	Version        string `json:"version"`
	Specifications []struct {
		Domain      string `json:"domain"`
		Title       string `json:"title"`
		Description string `json:"description"`
		PathCount   int    `json:"path_count"`
		SchemaCount int    `json:"schema_count"`
	} `json:"specifications"`
}

// DomainConfig represents xcsh domain configuration
type DomainConfig struct {
	Version           string                 `yaml:"version"`
	Aliases           map[string][]string    `yaml:"aliases"`
	DeprecatedDomains map[string]interface{} `yaml:"deprecated_domains"`
	MissingMetadata   []interface{}          `yaml:"missing_metadata"`
}

// ValidationResult represents a validation finding
type ValidationResult struct {
	Domain    string
	Issue     string
	Severity  string // "info", "warning", "error"
	Suggested string
}

func main() {
	configPath := flag.String("config", ".specs/domain_config.yaml", "Path to domain config")
	indexPath := flag.String("index", ".specs/index.json", "Path to spec index")
	// createIssues := flag.Bool("create-issues", false, "Create GitHub issues for missing metadata")  // Future feature
	verbose := flag.Bool("v", false, "Verbose output")

	flag.Parse()

	log.Println("🔍 Checking metadata completeness in upstream specs...")

	// Read spec index
	indexData, err := os.ReadFile(*indexPath)
	if err != nil {
		log.Fatalf("Failed to read spec index: %v", err)
	}

	var index SpecIndex
	if err := json.Unmarshal(indexData, &index); err != nil {
		log.Fatalf("Failed to parse spec index: %v", err)
	}

	// Read domain config
	configData, err := os.ReadFile(*configPath)
	if err != nil {
		log.Fatalf("Failed to read domain config: %v", err)
	}

	var config DomainConfig
	if err := yaml.Unmarshal(configData, &config); err != nil {
		log.Fatalf("Failed to parse domain config: %v", err)
	}

	var results []ValidationResult

	// Check each domain for required metadata
	for _, spec := range index.Specifications {
		if spec.PathCount == 0 && spec.SchemaCount == 0 {
			continue // Skip empty domains
		}

		// Check for title/description consistency
		if spec.Title == "" {
			results = append(results, ValidationResult{
				Domain:    spec.Domain,
				Issue:     "missing_title",
				Severity:  "warning",
				Suggested: "Add 'title' field to domain specification",
			})
		}

		if spec.Description == "" {
			results = append(results, ValidationResult{
				Domain:    spec.Domain,
				Issue:     "missing_description",
				Severity:  "info",
				Suggested: "Add 'description' field to domain specification",
			})
		}

		// Check for domain categorization (helpful for CLI organization)
		// In future spec versions, we'd look for a "category" field
		if *verbose {
			log.Printf("  ✓ Checked %s (%d paths, %d schemas)", spec.Domain, spec.PathCount, spec.SchemaCount)
		}
	}

	// Print results
	if len(results) > 0 {
		log.Printf("\n⚠️  Found %d metadata issues:\n", len(results))
		for _, r := range results {
			log.Printf("  [%s] %s: %s", r.Severity, r.Domain, r.Suggested)
		}
	} else {
		log.Println("✅ All metadata appears complete")
	}

	// Report summary
	log.Printf("\nSummary:")
	log.Printf("  Domains checked: %d", len(index.Specifications))
	log.Printf("  Issues found: %d", len(results))
	log.Printf("  Total paths: %d", countPaths(index))
	log.Printf("  Total schemas: %d", countSchemas(index))

	if len(results) > 0 {
		os.Exit(1)
	}
}

func countPaths(index SpecIndex) int {
	total := 0
	for _, spec := range index.Specifications {
		total += spec.PathCount
	}
	return total
}

func countSchemas(index SpecIndex) int {
	total := 0
	for _, spec := range index.Specifications {
		total += spec.SchemaCount
	}
	return total
}
