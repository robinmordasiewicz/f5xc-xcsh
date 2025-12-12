package openapi

import (
	"path/filepath"
	"strings"
)

// SpecMapper maps resource names to their corresponding OpenAPI spec files
type SpecMapper struct {
	specs       map[string]*Spec  // filename -> spec
	resourceMap map[string]string // resourceName -> filename
}

// NewSpecMapper creates a new spec mapper from loaded specs
func NewSpecMapper(specs map[string]*Spec) *SpecMapper {
	mapper := &SpecMapper{
		specs:       specs,
		resourceMap: make(map[string]string),
	}
	mapper.buildResourceMap()
	return mapper
}

// buildResourceMap builds the mapping from resource names to spec files
func (m *SpecMapper) buildResourceMap() {
	for filename, spec := range m.specs {
		// Skip sub-resource spec files (subscription, rrset, etc.)
		// These should not override the main resource mapping
		baseName := filepath.Base(filename)
		if isSubResourceSpec(baseName) {
			continue
		}

		// Extract resource names from schema names
		for schemaName := range spec.Components.Schemas {
			// Look for CreateRequest schemas
			if strings.HasSuffix(schemaName, "CreateRequest") {
				// Extract resource name by removing "CreateRequest" suffix
				resourceName := strings.TrimSuffix(schemaName, "CreateRequest")

				// Only store if not already mapped (prefer first/exact match)
				lowerName := strings.ToLower(resourceName)
				if _, exists := m.resourceMap[lowerName]; !exists {
					m.resourceMap[lowerName] = filename
				}
			}
		}

		// Also try to extract from filename
		// Format: docs-cloud-f5-com.XXXX.public.ves.io.schema.views.RESOURCE_NAME.ves-swagger.json
		parts := strings.Split(baseName, ".")
		if len(parts) >= 3 {
			// Try to find "views" or "schema" followed by resource name
			for i, part := range parts {
				if part == "views" || part == "schema" {
					if i+1 < len(parts) {
						resourceName := parts[i+1]
						// Skip generic parts
						if resourceName != "ves-swagger" && resourceName != "json" {
							// Only store if not already mapped
							lowerName := strings.ToLower(resourceName)
							if _, exists := m.resourceMap[lowerName]; !exists {
								m.resourceMap[lowerName] = filename
							}
						}
					}
				}
			}
		}
	}
}

// isSubResourceSpec returns true if the spec file is a sub-resource (e.g., subscription, rrset)
func isSubResourceSpec(filename string) bool {
	// Common sub-resource patterns that should not override main resources
	subResourcePatterns := []string{
		".subscription.",
		".rrset.",
		".v1_dns_monitor.",
	}
	lowerFilename := strings.ToLower(filename)
	for _, pattern := range subResourcePatterns {
		if strings.Contains(lowerFilename, pattern) {
			return true
		}
	}
	return false
}

// FindSpec finds the OpenAPI spec for a given resource name
func (m *SpecMapper) FindSpec(resourceName string) *Spec {
	// Try exact match first
	filename, ok := m.resourceMap[strings.ToLower(resourceName)]
	if ok {
		return m.specs[filename]
	}

	// Try with underscores removed
	normalized := strings.ReplaceAll(strings.ToLower(resourceName), "_", "")
	for name, filename := range m.resourceMap {
		if strings.ReplaceAll(name, "_", "") == normalized {
			return m.specs[filename]
		}
	}

	// Try partial match (resource name contained in spec filename)
	// Prefer exact resource name boundaries (e.g., dns_zone.ves-swagger over dns_zone.subscription)
	lowerResource := strings.ToLower(resourceName)
	resourceWithUnderscore := lowerResource + "."
	resourceWithoutUnderscore := strings.ReplaceAll(lowerResource, "_", "") + "."

	// First pass: look for exact boundary match (resource name followed by .ves-swagger)
	for filename, spec := range m.specs {
		lowerFilename := strings.ToLower(filename)
		baseName := filepath.Base(lowerFilename)

		// Skip sub-resource specs
		if isSubResourceSpec(baseName) {
			continue
		}

		// Check for exact resource name followed by .ves-swagger
		if strings.Contains(baseName, resourceWithUnderscore+"ves-swagger") ||
			strings.Contains(baseName, resourceWithoutUnderscore+"ves-swagger") {
			return spec
		}
	}

	// Second pass: any partial match (excluding sub-resources)
	for filename, spec := range m.specs {
		lowerFilename := strings.ToLower(filename)
		baseName := filepath.Base(lowerFilename)

		// Skip sub-resource specs
		if isSubResourceSpec(baseName) {
			continue
		}

		if strings.Contains(lowerFilename, lowerResource) ||
			strings.Contains(lowerFilename, strings.ReplaceAll(lowerResource, "_", "")) {
			return spec
		}
	}

	return nil
}

// FindSpecFile returns the filename of the spec for a given resource
func (m *SpecMapper) FindSpecFile(resourceName string) string {
	filename, ok := m.resourceMap[strings.ToLower(resourceName)]
	if ok {
		return filename
	}

	// Try partial match with exact boundary preference
	lowerResource := strings.ToLower(resourceName)
	resourceWithUnderscore := lowerResource + "."
	resourceWithoutUnderscore := strings.ReplaceAll(lowerResource, "_", "") + "."

	// First pass: look for exact boundary match
	for filename := range m.specs {
		lowerFilename := strings.ToLower(filename)
		baseName := filepath.Base(lowerFilename)

		// Skip sub-resource specs
		if isSubResourceSpec(baseName) {
			continue
		}

		if strings.Contains(baseName, resourceWithUnderscore+"ves-swagger") ||
			strings.Contains(baseName, resourceWithoutUnderscore+"ves-swagger") {
			return filename
		}
	}

	// Second pass: any partial match (excluding sub-resources)
	for filename := range m.specs {
		lowerFilename := strings.ToLower(filename)
		baseName := filepath.Base(lowerFilename)

		// Skip sub-resource specs
		if isSubResourceSpec(baseName) {
			continue
		}

		if strings.Contains(lowerFilename, lowerResource) ||
			strings.Contains(lowerFilename, strings.ReplaceAll(lowerResource, "_", "")) {
			return filename
		}
	}

	return ""
}

// GetMappedResources returns all resource names that have been mapped
func (m *SpecMapper) GetMappedResources() []string {
	resources := make([]string, 0, len(m.resourceMap))
	seen := make(map[string]bool)
	for name := range m.resourceMap {
		if !seen[name] {
			resources = append(resources, name)
			seen[name] = true
		}
	}
	return resources
}

// GetSpecCount returns the number of loaded specs
func (m *SpecMapper) GetSpecCount() int {
	return len(m.specs)
}

// GenerateExampleForResource generates a JSON example for the given resource
func (m *SpecMapper) GenerateExampleForResource(resourceName string) (string, error) {
	spec := m.FindSpec(resourceName)
	if spec == nil {
		return "", nil
	}

	generator := NewExampleGenerator(spec)
	return generator.GenerateCreateRequestExample(resourceName)
}

// ResourceSpecInfo contains information about a resource's spec
type ResourceSpecInfo struct {
	ResourceName    string
	SpecFile        string
	HasCreateSchema bool
	HasSpecSchema   bool
}

// GetResourceInfo returns information about a resource's OpenAPI spec
func (m *SpecMapper) GetResourceInfo(resourceName string) *ResourceSpecInfo {
	info := &ResourceSpecInfo{
		ResourceName: resourceName,
	}

	spec := m.FindSpec(resourceName)
	if spec == nil {
		return info
	}

	info.SpecFile = m.FindSpecFile(resourceName)
	info.HasCreateSchema = spec.FindCreateRequestSchema(resourceName) != nil
	info.HasSpecSchema = spec.FindCreateSpecTypeSchema(resourceName) != nil

	return info
}
